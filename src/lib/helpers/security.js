/*
* This is a security helper class with functions to help us with security tasks or validations.
* All of the secrets are encrypted in a vault.
* */
const Boom = require('@hapi/boom');
const Messages = require('../messages');

/*
* Validates if the current logged in user have rights to proceed CRUD actions on the database.
* Admins have all rights.
* */
const validateRights = async (auth, record) => {
  return (record.creationUserId !== auth.id && !auth.admin)
    ? Promise.reject(Boom.forbidden(Messages.permissionDenied))
    : true
}

module.exports = {
  validateRights
}