const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const { Post, User, Comment, Like } = require("../models");
const {
  EMAIL_LENGTH,
  MIN_VALID_POST_TITLE,
  MAX_VALID_POST_TITLE,
  MIN_VALID_POST_CONTENT,
  MAX_VALID_POST_CONTENT,
} = require("../utils/consts");

const inValidEmailErrorMessage = (email) => {
  if (!validator.isEmail(email)) return { message: "The Email is invalid!" };
};

const invalidPasswordErrorMessage = (password) => {
  if (
    validator.isEmpty(password) ||
    !validator.isLength(password, { min: EMAIL_LENGTH, max: EMAIL_LENGTH })
  )
    return { message: "The password is incorrect!" };
};

const userInputErrors = ({ email, password }) => {
  errors = [];
  if (inValidEmailErrorMessage(email))
    errors.push(inValidEmailErrorMessage(email));
  if (invalidPasswordErrorMessage(password))
    errors.push(invalidPasswordErrorMessage(password));

  return errors;
};

const invalidUserInputError = (errors) => {
  let error = new Error("Invalid user input.");
  error.data = errors;
  error.code = 422;

  return error;
};

const userDoesntExistError = () => {
  const error = new Error(`User doesn't exist!`);
  error.code = 401;

  return error;
};

const userAlreadyExistsError = () => {
  const error = new Error("User already exists!");
  error.code = 422;

  return error;
};

const userPasswordIsIncorrectError = () => {
  const error = new Error("The password you have entered is incorrect!");
  error.code = 401;

  return error;
};

const isPostTitleValid = (title) =>
  title.length >= MIN_VALID_POST_TITLE && title.length <= MAX_VALID_POST_TITLE;

const postTitleInvalidError = () => {
  const error = new Error("The title you have entered is inalid!");
  error.code = 401;

  return error;
};

const isPostContentValid = (content) =>
  content.length >= MIN_VALID_POST_CONTENT &&
  content.length <= MAX_VALID_POST_CONTENT;

const postContentInvalidError = () => {
  const error = new Error("The content you have entered is inalid!");
  error.code = 401;

  return error;
};

const isTagsContentValid = (tags) => tags.length > 0;

const postTagsInvalidError = () => {
  const error = new Error(
    "The length of the tags it soo short, choose atleast one tag!"
  );
  error.code = 401;

  return error;
};

const userNotAutoError = () => {
  const error = new Error("User is not authenticated!");
  error.code = 401;

  return error;
};

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

    return {
      _id: createdUser.id.toString(),
      firstName: createdUser.firstName.toString(),
      lastName: createdUser.lastName.toString(),
      email: createdUser.email.toString(),
      createdAt: createdUser.createdAt.toISOString(),
      updatedAt: createdUser.updatedAt.toISOString(),
    };
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
      "somesupersecretsecret",
      {
        expiresIn: "1h",
      }
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

    return {
      _id: createdPost.id.toString(),
      title: createdPost.title.toString(),
      content: createdPost.content.toString(),
      tags: createdPost.tags,
      imageUrl: createdPost.imageUrl.toString(),
      userId: createdPost.userId.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },
  fetchAllPosts: async (args, req) => {
    const fetchedPosts = await Post.findAll({ order: [["createdAt", "DESC"]] });
    const posts = fetchedPosts.map((post) => ({
      _id: post.id.toString(),
      title: post.title.toString(),
      content: post.content.toString(),
      tags: post.tags,
      imageUrl: post.imageUrl.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));

    return { posts: posts, totalPosts: posts.length };
  },
  fetchPostById: async ({ fetchPostInput }, req) => {
    const { postId } = fetchPostInput;
    const post = await Post.find({ where: { postId: postId } });
    return {
      _id: post.id.toString(),
      title: post.title.toString(),
      content: post.content.toString(),
      tags: post.tags,
      imageUrl: post.imageUrl.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
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

    return {
      _id: createdComment.id.toString(),
      content: createdComment.content.toString(),
      postId: createdComment.postId.toString(),
      userId: createdComment.userId.toString(),
      firstName: createdComment.firstName.toString(),
      lastName: createdComment.lastName.toString(),
      createdAt: createdComment.createdAt.toISOString(),
      updatedAt: createdComment.updatedAt.toISOString(),
    };
  },
  fetchAllComments: async ({ fetchCommentsInput }, req) => {
    const { postId } = fetchCommentsInput;

    const fetchedComments = await Comment.findAll({
      where: { postId: parseInt(postId) },
      order: [["createdAt", "DESC"]],
    });

    const comments = fetchedComments.map((comment) => ({
      _id: comment.id.toString(),
      userId: comment.userId.toString(),
      firstName: comment.firstName.toString(),
      lastName: comment.lastName.toString(),
      postId: comment.postId.toString(),
      content: comment.content.toString(),
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    }));

    return { comments: comments, totalComments: comments.length };
  },
  likePost: async ({ likePostInput }, req) => {
    if (!req.isAuth) throw userNotAutoError();

    const user = await User.findByPk(req.userId);
    if (!user) throw userDoesntExistError();

    const { postId } = likePostInput;

    const like = await Like.create({
      postId: parseInt(postId),
      userId: user.id,
    });
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
  },
};
