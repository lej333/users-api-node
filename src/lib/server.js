/**
 * Initializes a Node server.
 * Registers and configures JWT authorization and Joi validations.
 * Registers all routes in the api folder as server routes.
 * This routes are separated into multiple files for a better overview.
 */
const Hapi = require('@hapi/hapi');
const Glob = require('glob');
const Path = require('path');
const Config = require('./config');
const Vault = require('schluessel');

const initServer = async() => {

  const server = new Hapi.Server({
    port: Config.server.port,
    host: Config.server.host,
    routes: {
      cors:  Config.server.cors
    }
  });

  server.validator(require('@hapi/joi'))
  await server.register(require('hapi-auth-jwt2'));

  server.auth.strategy('jwt', 'jwt', {
    key: Vault.authKey,
    validate,
    verifyOptions: { algorithms: ['HS256']}
  });

  server.auth.default('jwt');

  Glob.sync('./api/**/routes/*.js', {
    root: __dirname
  }).forEach(file => {
    const route = require(Path.join(__dirname, '..', file));
    server.route(route);
  });

  return server;
}

/**
 * validates the jwt token and place the user information in request.auth.credentials.user
 * And the token information in http request.auth.credentials.token
 */
const validate = async function (decoded, request, h) {
  const user = decoded;
  if (!user || !user.id) {
    return { isValid: false };
  }
  return { isValid: true };
};

module.exports = {
  initServer
}