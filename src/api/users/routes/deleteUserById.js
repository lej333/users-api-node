/**
 * Deletes one user by its id.
 * Only allowed for admin users.
 */

const Users = require('../../../lib/data/users.service');
const Schema = require('../schemas/deleteUserById');

module.exports = {
  path: '/users/{userId}',
  method: 'DELETE',
  config: {
    auth: 'jwt',
    description: 'Deletes an existing user',
    security: true,
    validate: Schema
  },
  handler: async function (request, h) {
    const auth = request.auth.credentials.user;
    const userId = request.params.userId;
    return await Users.deleteById(auth, userId);
  }
};