module.exports = {
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
  contentBasedFilteringScore: (tagVector, post) => {
    let postScore;
    post.tags.forEach(
      (tag) =>
        (postScore = tagVector[tag] ? postScore + tagVector[tag] : postScore)
    );

    return postScore;
  },
};
