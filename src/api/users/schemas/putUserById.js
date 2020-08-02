// params validation for putUser

const Joi = require('@hapi/joi');

module.exports = {
  params: {
    userId: Joi.string().required()
  }
};
