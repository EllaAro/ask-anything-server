const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { Post, User, Comment, Like, Op } = require("../models");
const {
  userInputErrors,
  invalidUserInputError,
  userDoesntExistError,
  userAlreadyExistsError,
  userPasswordIsIncorrectError,
  isPostTitleValid,
  postTitleInvalidError,
  isPostContentValid,
  postContentInvalidError,
  isTagsContentValid,
  postTagsInvalidError,
  userNotAutoError,
} = require("../utils/errorHandler");
const {
  createTagsVector,
  createLikesVector,
  contentBasedFilteringScore,
  postScoreByLikeCount,
} = require("../utils/helperHandler");
const {
  returnedPostsFormat,
  createdPostFormat,
  createdUserFormat,
  postFormat,
  createdCommentFormat,
} = require("../utils/formattingHandler");

module.exports = {
  createUser: async ({ userInput }) => {
    const errors = userInputErrors(userInput);
    if (errors.length > 0) throw invalidUserInputError(errors);

    const existingUser = await User.findOne({
      where: { email: userInput.email },
    });
    if (existingUser) throw userAlreadyExistsError();

    const hashedPwd = await bcrypt.hash(userInput.password, 12);
    let createdUser = await User.create({
      firstName: userInput.firstName,
      lastName: userInput.lastName,
      email: userInput.email,
      password: hashedPwd,
    });

    return createdUserFormat(createdUser);
  },
  signIn: async ({ signinInput }) => {
    const user = await User.findOne({ where: { email: signinInput.email } });
    if (!user) throw userDoesntExistError();

    const isEqual = await bcrypt.compare(signinInput.password, user.password);
    if (!isEqual) throw userPasswordIsIncorrectError();

    const token = jwt.sign(
      {
        userId: user.id.toString(),
        email: user.email,
      },
      "somesupersecretsecret"
    );
    return { token: token, userId: user.id.toString() };
  },
  createPost: async ({ postInput }, req) => {
    if (!req.isAuth) throw userNotAutoError();

    const user = await User.findByPk(req.userId);
    if (!user) throw userDoesntExistError();

    const { title, content, tags, imageUrl } = postInput;

    if (!isPostTitleValid(title)) throw postTitleInvalidError();
    if (!isPostContentValid(content)) throw postContentInvalidError();
    if (!isTagsContentValid(tags)) throw postTagsInvalidError();

    let createdPost = await Post.create({
      title: title,
      content: content,
      tags: tags,
      imageUrl: imageUrl,
      userId: req.userId,
    });

    return createdPostFormat(createdPost);
  },
  fetchAllPosts: async (args, req) => {
    const fetchedPosts = await Post.findAll({ order: [["createdAt", "DESC"]] });
    const posts = returnedPostsFormat(fetchedPosts);

    return { posts: posts, totalPosts: posts.length };
  },
  fetchAllUserPosts: async (args, req) => {
    if (!req.isAuth) throw userNotAutoError();

    const user = await User.findByPk(req.userId);
    if (!user) throw userDoesntExistError();

    const userId = user.id;

    const fetchedPosts = await Post.findAll({
      where: { userId: userId },
      order: [["createdAt", "DESC"]],
    });
    const posts = returnedPostsFormat(fetchedPosts);

    return { posts: posts, totalPosts: posts.length };
  },
  fetchRecommendedUserPosts: async (args, req) => {
    if (!req.isAuth) throw userNotAutoError();

    const user = await User.findByPk(req.userId);
    if (!user) throw userDoesntExistError();

    const userId = user.id;

    const fetchedUserLikes = await Like.findAll({
      where: {
        userId: userId,
      },
    });

    const postsIds = fetchedUserLikes.map((like) => like.postId);

    const fetchedUserLikedPosts = await Post.findAll({
      where: {
        id: {
          [Op.in]: postsIds,
        },
      },
    });

    const tagsVector = createTagsVector(fetchedUserLikedPosts);
    const fetchedPosts = await Post.findAll();

    fetchedPosts.sort(
      (p1, p2) =>
        contentBasedFilteringScore(tagsVector, p2) -
        contentBasedFilteringScore(tagsVector, p1)
    );
    const posts = returnedPostsFormat(fetchedPosts);

    return { posts: posts, totalPosts: posts.length };
  },
  fetchTrendingPosts: async (args, req) => {
    const likes = await Like.findAll();
    const likesVector = createLikesVector(likes);
    const fetchedPosts = await Post.findAll();

    fetchedPosts.sort(
      (p1, p2) =>
        postScoreByLikeCount(likesVector, p2) -
        postScoreByLikeCount(likesVector, p1)
    );
    const posts = returnedPostsFormat(fetchedPosts);

    return { posts: posts, totalPosts: posts.length };
  },
  fetchPostById: async ({ fetchPostInput }, req) => {
    const { postId } = fetchPostInput;
    const post = await Post.find({ where: { postId: postId } });

    return postFormat(post);
  },
  createComment: async ({ commentInput }, req) => {
    if (!req.isAuth) throw userNotAutoError();

    const user = await User.findByPk(req.userId);
    if (!user) throw userDoesntExistError();

    const { postId, content } = commentInput;

    let createdComment = await Comment.create({
      content: content,
      postId: parseInt(postId),
      userId: req.userId,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return createdCommentFormat(createdComment);
  },
  fetchAllComments: async ({ fetchCommentsInput }, req) => {
    const { postId } = fetchCommentsInput;

    const fetchedComments = await Comment.findAll({
      where: { postId: parseInt(postId) },
      order: [["createdAt", "DESC"]],
    });

    const comments = fetchedComments.map((comment) =>
      createdCommentFormat(comment)
    );

    return { comments: comments, totalComments: comments.length };
  },
  likePost: async ({ likePostInput }, req) => {
    if (!req.isAuth) throw userNotAutoError();

    const user = await User.findByPk(req.userId);
    if (!user) throw userDoesntExistError();

    const { postId } = likePostInput;
    let like;

    like = await Like.findOne({
      where: { postId: parseInt(postId), userId: user.id },
    });

    if (!like) {
      like = await Like.create({
        postId: parseInt(postId),
        userId: user.id,
      });
    }
    return { _id: like.id.toString() };
  },
  unLikePost: async ({ likePostInput }, req) => {
    if (!req.isAuth) throw userNotAutoError();

    const user = await User.findByPk(req.userId);
    if (!user) throw userDoesntExistError();

    const { postId } = likePostInput;

    const like = await Like.findOne({
      where: { postId: parseInt(postId), userId: user.id },
    });
    const likeId = like.id;

    await like.destroy();

    return { _id: likeId.toString() };
  },
  numberOfPostLikes: async ({ likePostInput }, req) => {
    const { postId } = likePostInput;

    const likesCount = await Like.count({
      where: { postId: parseInt(postId) },
    });

    return { likesCount: likesCount };
  },
  fetchLikedPosts: async (args, req) => {
    if (!req.isAuth) throw userNotAutoError();

    const user = await User.findByPk(req.userId);
    if (!user) throw userDoesntExistError();

    const userId = user.id;

    const fetchedLikedPostByUserId = Like.findAll({
      where: { userId: userId },
    });
    const likedPostByUserId = fetchedLikedPostByUserId.map((like) =>
      like.postId.toString()
    );
    return { postsId: likedPostByUserId };
  },
};
