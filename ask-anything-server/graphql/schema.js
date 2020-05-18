const { buildSchema } = require('graphql');

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
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type AutoData {
        token: String!
        userId: String!
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

   input loggedInUserData {
        email: String!
        password: String!
   }

    type RootMutation {
        createUser(userInput: userInputData): User!
        createPost(postInput: postInputData): Post!
   }

   type RootQuery {
        login(loginInput: loggedInUserData): AutoData!
        fetchAllPosts: [Post!]!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);