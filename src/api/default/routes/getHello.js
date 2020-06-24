/**
 * Standard endpoint to say hello!
 * With this endpoint you can test your authorization token.
 * When it fails, it will return unauthorized HTTP response.
 */

module.exports = {
  path: '/hello',
  method: 'GET',
  config: {
    auth: 'jwt',
    description: 'Test authorization token, does it fit?',
    security: true
  },
  handler: function (request, h) {
    const user = request.auth.credentials;
    return `Hi ${user.contactName} [${user.id}], this is a fine authorization token!`;
  }
};
