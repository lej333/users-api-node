/**
 * This test tests the MongoDb helper class which contains functions to allow you to do CRUD actions on collections.
 * There are 6 basic functions to create/add, search, get one, delete one and update one in MongoDb collections.
 * This tests will use users collection for test purposes, all test data will be erased after.
 */
process.env.NODE_ENV = 'test';

const Mongoose = require('mongoose');
const Boom = require('@hapi/boom');
const assert = require('assert');
const _ = require('lodash');

const MongoDb = require('../../src/lib/helpers/mongoDb');
const Init = require('../../src');
const Users = require('../../src/lib/data/users.service');
const Schema = require('../../src/lib/data/users.model');

const Security = require('../../src/lib/helpers/security');
const CleanTests = require('./cleanTests');
const ErrorTests = require('./errorTests');
const Messages = require('../../src/lib/messages');

describe('lib/data/users/users.service.getById', () => {

  const Db = MongoDb.db(Schema);

  const user = {
    username: 'test user',
    password: 'T3st!ngs',
    admin: false,
    firstName: 'Test',
    namePrefix: '',
    lastName: 'User'
  }
  let userId = '';

  before(async () => {
    await CleanTests.cleanUser(user.username);
    user.hash = Security.createHash('testing');
    const result = await Db.add(user, null, Schema);
    if (result) {
      userId = result._id.toString();
    }
    delete user.hash;
  });

  after(async () => {
    await CleanTests.cleanUser(user.username);
  });

  it('getById', async () => {
    const auth = {
      id: 'this-is-an-user-id',
      firstName: 'User',
      admin: true
    }
    const result = await Users.getById(auth, userId);
    assert.equal(_.isObject(result), true, 'Must return an object value');
    assert.equal(!_.isEmpty(result._id), true, 'Contains expected fields: id. This field is added by MongoDB.');
    assert.equal(!_.isEmpty(result.username), true, 'Contains expected fields: username');
    assert.equal(_.isEmpty(result.hash), true, 'May not return the hash field');
    return true;
  });

  it('getById as non-admin', async () => {
    const auth = {
      id: 'this-is-an-user-id',
      firstName: 'User',
      admin: false
    }
    return Users.getById(auth, userId).then((result) => {
      throw 'We expected an error!';
    }).catch((err) => {
      return ErrorTests.error(err, Messages.getPermissionDenied);
    });
  });

  it('getById as non-admin with same id', async () => {
    const auth = {
      id: userId,
      firstName: 'User',
      admin: false
    }
    const result = await Users.getById(auth, userId);
    assert.equal(_.isObject(result), true, 'Must return an object value');
    assert.equal(!_.isEmpty(result._id), true, 'Contains expected fields: id. This field is added by MongoDB.');
    assert.equal(!_.isEmpty(result.username), true, 'Contains expected fields: username');
    assert.equal(_.isEmpty(result.hash), true, 'May not return the hash field');
  });

  it('getById without admin in the auth token', async () => {
    const auth = {
      id: 'this-is-an-user-id',
      firstName: 'User'
    }
    return Users.getById(auth, userId).then((result) => {
      throw 'We expected an error!';
    }).catch((err) => {
      return ErrorTests.error(err, Messages.getPermissionDenied);
    });
  });

  it('getById with null admin property', async () => {
    const auth = {
      id: 'this-is-an-user-id',
      firstName: 'User',
      admin: null
    }
    return Users.getById(auth, userId).then((result) => {
      throw 'We expected an error!';
    }).catch((err) => {
      return ErrorTests.error(err, Messages.getPermissionDenied);
    });
  });

  it('getById without userId', async () => {
    const auth = {
      id: 'this-is-an-user-id',
      firstName: 'User',
      admin: true
    }
    return Users.getById(auth, null).then((result) => {
      throw 'We expected an error!';
    }).catch((err) => {
      return ErrorTests.error(err, Messages.idNotValid);
    });
  });

  it('getById with non-existing user', async () => {
    const auth = {
      id: 'this-is-an-user-id',
      firstName: 'User',
      admin: true
    }
    const nonExist = Mongoose.Types.ObjectId();
    return Users.getById(auth, nonExist).then((result) => {
      throw 'We expected an error!';
    }).catch((err) => {
      return ErrorTests.error(err, Messages.getNotFound);
    });
  });

  it('getById with non-objectID value', async () => {
    const auth = {
      id: 'this-is-an-user-id',
      firstName: 'User',
      admin: true
    }
    return Users.getById(auth, 'non-object-id').then((result) => {
      throw 'We expected an error!';
    }).catch((err) => {
      return ErrorTests.error(err, Messages.idNotValid);
    });
  });

});