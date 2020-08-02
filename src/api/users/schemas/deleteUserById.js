// params validation for postCustomer

const Joi = require('@hapi/joi');

module.exports = {
  params: {
    userId: Joi.string().required()
  }
};
