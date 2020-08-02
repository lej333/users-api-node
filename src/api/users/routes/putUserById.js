/**
 * Updates an existing user by its id.
 * Returns an updated user object.
 */

const Users = require('../../../lib/data/users.service');
const Schema = require('../schemas/putUserById');
const Logger = require('../../../lib/logger');

module.exports = {
  path: '/users/{userId}',
  method: 'PUT',
  config: {
    auth: 'jwt',
    description: 'Updates an existing user',
    security: true,
    validate: Schema
  },
  handler: async function (request, h) {
    const auth = request.auth.credentials.user;
    const userId = request.params.userId;
    return Users.updateById(auth, userId, request.payload).then((user) => {
      return user;
    }).catch((err) => {
      Logger.logError(err);
      return err;
    });
  }
};