const validator = require("validator");

const {
  EMAIL_LENGTH,
  MIN_VALID_POST_TITLE,
  MAX_VALID_POST_TITLE,
  MIN_VALID_POST_CONTENT,
  MAX_VALID_POST_CONTENT,
} = require("../utils/consts");

const inValidEmailErrorMessage = (email) => {
  if (!validator.isEmail(email)) return { message: "The Email is invalid!" };
};

const invalidPasswordErrorMessage = (password) => {
  if (
    validator.isEmpty(password) ||
    !validator.isLength(password, { min: EMAIL_LENGTH, max: EMAIL_LENGTH })
  )
    return { message: "The password is incorrect!" };
};

module.exports = {
  userInputErrors: ({ email, password }) => {
    errors = [];
    if (inValidEmailErrorMessage(email))
      errors.push(inValidEmailErrorMessage(email));
    if (invalidPasswordErrorMessage(password))
      errors.push(invalidPasswordErrorMessage(password));

    return errors;
  },
  invalidUserInputError: (errors) => {
    let error = new Error("Invalid user input.");
    error.data = errors;
    error.code = 422;

    return error;
  },
  userDoesntExistError: () => {
    const error = new Error(`User doesn't exist!`);
    error.code = 401;

    return error;
  },
  userAlreadyExistsError: () => {
    const error = new Error("User already exists!");
    error.code = 422;

    return error;
  },
  userPasswordIsIncorrectError: () => {
    const error = new Error("The password you have entered is incorrect!");
    error.code = 401;

    return error;
  },
  isPostTitleValid: (title) =>
    title.length >= MIN_VALID_POST_TITLE &&
    title.length <= MAX_VALID_POST_TITLE,
  postTitleInvalidError: () => {
    const error = new Error("The title you have entered is inalid!");
    error.code = 401;

    return error;
  },
  isPostContentValid: (content) =>
    content.length >= MIN_VALID_POST_CONTENT &&
    content.length <= MAX_VALID_POST_CONTENT,
  postContentInvalidError: () => {
    const error = new Error("The content you have entered is inalid!");
    error.code = 401;

    return error;
  },
  isTagsContentValid: (tags) => tags.length > 0,
  postTagsInvalidError: () => {
    const error = new Error(
      "The length of the tags it soo short, choose atleast one tag!"
    );
    error.code = 401;

    return error;
  },
  userNotAutoError: () => {
    const error = new Error("User is not authenticated!");
    error.code = 401;

    return error;
  },
};
