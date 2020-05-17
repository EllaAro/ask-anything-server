const bcrypt = require('bcryptjs');
const validator = require('validator');

const { Post, User } = require('../models');
const { EMAIL_LENGTH } = require('../utils/consts');

const checkIfEmpty = ( field, fieldName, errorArr ) => {
    if( validator.isEmpty(field) ) errorArr.push({ message: `${fieldName} is empty!` });
    return errorArr;
}

const userInputErrors = userInput => {
    errors = [];
    if (!validator.isEmail(userInput.email)) errors.push( { message: 'The Email is invalid!' } );
    if (validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, { min: EMAIL_LENGTH, max: EMAIL_LENGTH })) errors.push( { message: 'The password is incorrect!' } );
    
    return errors;
}

const errorData = errors => {
    if (errors.length > 0) {
        let error = new Error('Invalid user input.');
        error.data = errors;
        error.code = 422;
        return error;
    }
}

module.exports = {
    createUser: async ({ userInput }, req) => {
    
        if ( errorData(userInputErrors(userInput)) ) throw errorData(userInputErrors(userInput));
        
        const existingUser = await User.findOne({ where: {email: userInput.email} });
        if (existingUser) throw new Error('User already exists!');
    
        const hashedPwd = await bcrypt.hash(userInput.password, 12);
        let createdUser = await User.create({
            firstName: userInput.firstName,
            lastName: userInput.lastName,
            email: userInput.email,
            password: hashedPwd,
        })

        return {
            _id: createdUser.id.toString(),
            firstName: createdUser.firstName.toString(),
            lastName: createdUser.lastName.toString(),
            email: createdUser.email.toString(),
            createdAt: createdUser.createdAt.toString(),
            updatedAt: createdUser.updatedAt.toString(),
        }
    },
    createPost: async ({ postInput }, req) => {
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
            tags: postInput.tags,
        });

        return {
            _id: createdPost.id.toString(),
            title: createdPost.title.toString(),
            content: createdPost.content.toString(),
            tags: createPost.tags,
            createdAt: createdPost.createdAt.toString(),
            updatedAt: createdPost.updatedAt.toString(),
          };
    },
    fetchAllPosts: async (args, req) => {
        const fetchedPosts = await Post.findAll();
        const posts = fetchedPosts.map(post => {
            return {
                _id: post.id.toString(),
                title: post.title.toString(),
                content: post.content.toString(),
                tags: post.tags,
                createdAt: post.createdAt.toString(),
                updatedAt: post.updatedAt.toString(),
            }
        })
        return posts;
    },
};


