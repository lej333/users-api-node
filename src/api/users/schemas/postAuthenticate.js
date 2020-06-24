// Request validation for postAuthenticate

const Joi = require('@hapi/joi');

module.exports = {
  payload: {
    username: Joi.string().required(),
    password: Joi.string().required()
  }
};
