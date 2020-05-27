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
        userId: Int!
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
   }

   input signedInUserData {
        email: String!
        password: String!
   }

    type RootMutation {
        createUser(userInput: userInputData): User!
        createPost(postInput: postInputData): Post!
   }

   type RootQuery {
        signIn(signinInput: signedInUserData): AutoData!
        fetchAllPosts: PostsData!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
