// params validation for getUserById

const Joi = require('@hapi/joi');

module.exports = {
  params: {
    userId: Joi.string().required()
  }
};
