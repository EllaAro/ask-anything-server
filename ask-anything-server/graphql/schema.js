const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    
    type Post {
        _id: ID!
        title: String!
        content: String!
        createdAt: String!
        updatedAt: String!
    }
    
    type User {
        _id: ID!
        name: String!
        password: String
        status: String!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
   }

   input postInputData {
        title: String!
        content: String!
   }
    type RootMutation {
        createPost(postInput: postInputData): Post!
   }

    schema {
        mutation: RootMutation
    }
`);