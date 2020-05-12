const { Post } = require('../models');
const validator = require('validator');

const checkIfEmpty = ( field, fieldName, errorArr ) => {
    if( validator.isEmpty(field) ) errorArr.push({ message: `${fieldName} is empty!` });
    return errorArr;
}

module.exports = {
    createPost: async function({ postInput }, req) {
        let errors = [];
        errors = checkIfEmpty(postInput.title, 'title', errors);
        errors = checkIfEmpty(postInput.content, 'post content', errors);
        if (errors.length > 0) {
            let error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
          }

        let createdPost = await Post.create({
            title: postInput.title,
            content: postInput.content,
            tags: postInput.tags
        });

        return {
            _id: createdPost.id.toString(),
            title: createdPost.title.toString(),
            content: createdPost.content.toString(),
            createdAt: createdPost.createdAt.toString(),
            updatedAt: createdPost.updatedAt.toString(),
          };
    }
};


