// params validation for putUserById

const Joi = require('@hapi/joi');

module.exports = {
  params: {
    userId: Joi.string().required()
  }
};
