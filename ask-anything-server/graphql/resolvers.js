const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const { Post, User } = require('../models');
const { EMAIL_LENGTH,
        MIN_VALID_POST_TITLE,
        MAX_VALID_POST_TITLE,
        MIN_VALID_POST_CONTENT,
        MAX_VALID_POST_CONTENT,
      } = require('../utils/consts');

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

const userPasswordIsIncorrectError = () => {
    const error = new Error ('The password you have entered is incorrect!');
    error.code = 401;

    return error;
}

const isPostTitleValid = title => title.length >= MIN_VALID_POST_TITLE && title.length <= MAX_VALID_POST_TITLE;

const postTitleInvalidError = ()  => {
    const error = new Error ('The title you have entered is inalid!');
    error.code = 401;

    return error;
}

const isPostContentValid = content => content.length>= MIN_VALID_POST_CONTENT && content.length <= MAX_VALID_POST_CONTENT;

const postContentInvalidError = ()  => {
    const error = new Error ('The content you have entered is inalid!');
    error.code = 401;

    return error;
}

const isTagsContentValid = tags => tags.length > 0;

const postTagsInvalidError = ()  => {
    const error = new Error ('The length of the tags it soo short, choose atleast one tag!');
    error.code = 401;

    return error;
}

const userNotAutoError = () => {
    const error = new Error('User is not authenticated!');
    error.code = 401;
    
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
    signIn: async ({signinInput}) => {

        const user = await User.findOne({ where: {email: signinInput.email} });
        if (!user) throw userDoesntExistError();

        const isEqual = await bcrypt.compare(signinInput.password, user.password);
        if (!isEqual) throw userPasswordIsIncorrectError();

        const token = jwt.sign(
            {
            userId: user.id.toString(),
            email: user.email,
            }, 
            'somethingsupersecret', 
            { 
                expiresIn:'1h' 
            }
        );
        
        return { token: token, userId: user.id.toString() };
    },
    createPost: async ({ postInput }, req) => {

        if (!req.isAuto) throw userNotAutoError();
        
        const user = await User.findByPk(req.userId);
        if (!user) throw userDoesntExistError();
        
        const { title, content, tags } = postInput;

        if (!isPostTitleValid(title)) throw postTitleInvalidError();
        if (!isPostContentValid(content)) throw postContentInvalidError();
        if (!isTagsContentValid(tags)) throw postTagsInvalidError();

        let createdPost = await Post.create({
            title: title,
            content: content,
            tags: tags,
            userId: user.id
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

        if (!req.isAuto) throw userNotAutoError();

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


