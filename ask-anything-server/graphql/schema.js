const { buildSchema } = require("graphql");

module.exports = buildSchema(`

    type User {
        _id: ID!
        firstName: String!
        lastName: String!
        email: String!
        createdAt: String!
        updatedAt: String!
        posts: [Post!]!
    }
    
    type Post {
        _id: ID!
        title: String!
        content: String!
        tags: [String!]!
        imageUrl: String!
        userId: Int!
        createdAt: String!
        updatedAt: String!
    }

    type Comment {
        _id: ID!
        userId: Int!
        firstName: String!
        lastName: String!
        postId: Int!
        content: String!
        createdAt: String!
        updatedAt: String!
    }

    type AutoData {
        token: String!
        userId: String!
    }

    type PostsData {
        posts: [Post!]!
        totalPosts: Int!
    }

    type LikesData {
        postsId: [String!]!
    }

    type CommentsData {
        comments: [Comment!]!
        totalComments: Int!
    }

    type likedPostData {
        _id: ID!
    }
    
    type likesCountData {
        likesCount: Int!
    }

    input userInputData {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
    }

    input postInputData {
        title: String!
        content: String!
        tags: [String!]!
        imageUrl: String!
   }

   input signedInUserData {
        email: String!
        password: String!
   }

   input commentInputData {
       postId: String!
       content: String!
   }

   input fetchCommentsData {
        postId: String!
   }

   input likePostData {
        postId: String!
   }

    type RootMutation {
        createUser(userInput: userInputData): User!
        createPost(postInput: postInputData): Post!
        createComment(commentInput: commentInputData): Comment!
        likePost(likePostInput: likePostData): likedPostData!
        unLikePost(likePostInput: likePostData): likedPostData!
   }

   type RootQuery {
        signIn(signinInput: signedInUserData): AutoData!
        fetchAllPosts: PostsData!
        fetchAllComments(fetchCommentsInput: fetchCommentsData): CommentsData!
        numberOfPostLikes(likePostInput: likePostData): likesCountData!
        fetchLikedPosts: LikesData!
        fetchAllUserPosts: PostsData!
        fetchRecommendedUserPosts: PostsData!
        fetchTrendingPosts: PostsData!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
