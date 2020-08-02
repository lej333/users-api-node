const Boom = require('@hapi/boom');

const MongoDb = require('../helpers/mongoDb');
const Schema = require('./users.model');
const Security = require('../helpers/security');
const Messages = require('../messages');

/*
* Authenticate login of one user by its username and password.
* Will return complete user object without hashed password.
* An authorization token based on user.id, user.firstName and user.admin will be returned as well.
* This token will be valid for 24 hours (by default).
* */
async function authenticate(username, password) {
  const search = {
    username: username
  };
  const Db = MongoDb.db(Schema);
  let user = await Db.search(search, null, null);
  if (!user || !user.length) {
    return Promise.reject(Boom.forbidden(Messages.loginFailed));
  }
  user = user[0];
  if (Security.createHash(password) !== user.hash) {
    return Promise.reject(Boom.forbidden(Messages.loginFailed));
  }

  const { hash, ...userWithoutHash } = user.toObject();
  const token = Security.createToken({
    id: user.id,
    firstName: user.firstName,
    admin: user.admin
  });

  return {
    ...userWithoutHash,
    token
  };
}

/*
* Returns list with all users without its password hashes.
* Allowed for admin users only!
* */
async function list(auth) {
  if (!auth.admin) {
    return Promise.reject(Boom.forbidden(Messages.permissionDenied));
  }

  const sort = {
    creationDate: -1
  };
  const Db = MongoDb.db(Schema);
  return await Db.search(null, sort, '-hash');
}

/*
* Returns one user by its id.
* Allowed when is same user as in the authorization header or you're an admin.
* */
async function getById(auth, userId) {
  if (auth.id !== userId && !auth.admin) {
    return Promise.reject(Boom.forbidden(Messages.getPermissionDenied));
  }

  const Db = MongoDb.db(Schema);
  const user = await Db.getById(userId, '-hash');
  if (!user) {
    return Promise.reject(Boom.notFound(Messages.getNotFound));
  }
  return user;
}

/*
* Adds one new user.
* Only admins can do this!
* Will check if the passed username is unique.
* The passed password will be saved hashed in MongoDB collection.
* */
async function add(auth, user) {
  if (!auth.admin) {
    return Promise.reject(Boom.forbidden(Messages.addPermissionDenied));
  }
  if (!Security.validatePassword(user.password)) {
    return Promise.reject(Boom.badData(Messages.weakPassword));
  }

  const search = {
    username: user.username
  };
  const Db = MongoDb.db(Schema);
  const exists = await Db.search(search, null, null);
  if (exists.length) {
    return Promise.reject(Boom.badData(Messages.usernameNotUnique));
  }

  user.creationUserId = auth.id;
  user.hash = Security.createHash(user.password);
  return await Db.add(user, '-hash');
}

/*
* Updates one existing user by its id.
* Allowed when is same id as in the authorization header or you're an admin.
* When the username is changed, check if its still unique.
* */
async function updateById(auth, userId, user) {
  if (auth.id !== userId && !auth.admin) {
    return Promise.reject(Boom.forbidden(Messages.updatePermissionDenied));
  }

  const Db = MongoDb.db(Schema);
  let current = await Db.getById(userId, null);
  if (!current) {
    return Promise.reject(Boom.notFound(Messages.updateNotFound));
  }

  if (current.username !== user.username) {
    const search = {
      username: user.username
    };
    const exists = await Db.search(search, null, null);
    if (exists.length) {
      return Promise.reject(Boom.notFound(Messages.usernameNotUnique));
    }
  }

  Object.assign(current, user);
  if (user.password) {
    if (!Security.validatePassword(user.password)) {
      return Promise.reject(Boom.badData(Messages.weakPassword));
    }
    current.hash = Security.createHash(user.password);
  }
  current.modifiedDate = Date.now();
  current.modifiedUserId = auth.id;

  return await Db.updateById(userId, current, '-hash');
}

/*
* Deletes one user by its id.
* Allowed when the userId is same as in the authorization header or you're an admin.
* */
async function deleteById(auth, userId) {
  if (auth.id !== userId && !auth.admin) {
    return Promise.reject(Boom.forbidden(Messages.deletePermissionDenied));
  }
  await getById(auth, userId);

  const Db = MongoDb.db(Schema);
  return await Db.deleteById(userId, '-hash');
}

module.exports = {
  authenticate,
  list,
  getById,
  updateById,
  deleteById,
  add
}