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
  createdPostFormat: (createdPost) => {
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
  postFormat: (post) => {
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
  createdUserFormat: (createdUser) => {
    return {
      _id: createdUser.id.toString(),
      firstName: createdUser.firstName.toString(),
      lastName: createdUser.lastName.toString(),
      email: createdUser.email.toString(),
      createdAt: createdUser.createdAt.toISOString(),
      updatedAt: createdUser.updatedAt.toISOString(),
    };
  },
  createdCommentFormat: (createdComment) => {
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
};
