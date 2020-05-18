const bcrypt = require('bcryptjs');
const validator = require('validator');

const { Post, User } = require('../models');
const { EMAIL_LENGTH } = require('../utils/consts');

const EmptyFieldErrorMessage = ( field, fieldName ) => {
    if( validator.isEmpty(field) ) return { message: `${fieldName} is empty!` };
}

const inValidEmailErrorMessage = (email) => {
    if (!validator.isEmail(email)) return { message: 'The Email is invalid!' };
}

const invalidPasswordErrorMessage = (password) => {
    if (validator.isEmpty(password) || 
        !validator.isLength(password, { min: EMAIL_LENGTH, max: EMAIL_LENGTH })) return { message: 'The password is incorrect!' } ;
}

const userInputErrors = ({ email, password }) => {
    errors = [];
    if (inValidEmailErrorMessage(email)) errors.push(inValidEmailErrorMessage(email));
    if (invalidPasswordErrorMessage(password)) errors.push(invalidPasswordErrorMessage(password));
    
    return errors;
}

const invalidUserInputError = errors => {
    let error = new Error('Invalid user input.');
    error.data = errors;
    error.code = 422;

    return error;
}

const userDoesntExistError = () => {
    const error = new Error (`User doesn't exist!`);
    error.code = 401;

    return error;
}

const userAlreadyExistsError = () => {
    const error = new Error ('User already exists!');
    error.code = 422;

    return error;
}

module.exports = {
    createUser: async ({ userInput }) => {
        const errors = userInputErrors(userInput);
        if ( errors.length > 0 ) throw  invalidUserInputError(errors);
        
        const existingUser = await User.findOne({ where: {email: userInput.email} });
        if (existingUser) throw userAlreadyExistsError();
    
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
    login: async ({loginInput}) => {

        const user = await User.findOne({ where: {email: loginInput.email} });
        if (!user) throw userDoesntExistError();


    },
    createPost: async ({ postInput }, req) => {
        let errors = [];
        if( EmptyFieldErrorMessage(postInput.title, 'title')) errors.push(EmptyFieldErrorMessage(postInput.title, 'title'));
        if( EmptyFieldErrorMessage(postInput.content, 'post content')); errors.push(EmptyFieldErrorMessage(postInput.content, 'post content'));
        if ( errors.length > 0 ) throw errorData(errors);

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


