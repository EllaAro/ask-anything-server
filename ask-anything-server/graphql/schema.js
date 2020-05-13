const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    
    type Post {
        _id: ID!
        title: String!
        content: String!
        tags: [String!]!
        createdAt: String!
        updatedAt: String!
    }
    
   input postInputData {
        title: String!
        content: String!
        tags: [String!]!
   }
    type RootMutation {
        createPost(postInput: postInputData): Post!
   }

   type RootQuery {
        fetchAllPosts: [Post!]!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);