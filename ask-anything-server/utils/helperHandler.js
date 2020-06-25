module.exports = {
  returnedPostsFormat: (fetchedPosts) => {
    return fetchedPosts.map((post) => ({
      _id: post.id.toString(),
      title: post.title.toString(),
      content: post.content.toString(),
      tags: post.tags,
      imageUrl: post.imageUrl.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));
  },
  createTagsVector: (posts) => {
    const tagUserVector = {};
    let postTags;

    posts.forEach((post) => {
      postTags = post.tags;

      postTags.forEach(
        (tag) =>
          (tagUserVector[tag] = tagUserVector[tag] ? tagUserVector[tag] + 1 : 1)
      );
    });

    return tagUserVector;
  },
  createLikesVector: (likes) => {
    const likesVector = {};
    likes.forEach((like) => {
      likesVector[like.postId] = likesVector[like.postId]
        ? likesVector[like.postId] + 1
        : 1;
    });

    return likesVector;
  },
  contentBasedFilteringScore: (tagVector, post) => {
    const postTags = post.tags;
    let postScore = 0;

    postTags.forEach((tag) => {
      postScore += tagVector[tag] ? Math.pow(tagVector[tag], 2) : 0;
    });

    return postScore;
  },
  postScoreByLikeCount: (likesVector, post) =>
    likesVector[post.id] ? likesVector[post.id] : 0,
};
