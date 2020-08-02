// params validation for deleteUserById

const Joi = require('@hapi/joi');

module.exports = {
  params: {
    userId: Joi.string().required()
  }
};
