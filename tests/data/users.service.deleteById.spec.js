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

const Init = require('../../../../src');
const Users = require('../../../../src/lib/data/users/users.service');
const Schema = require('../../../../src/lib/data/users/users.model');

const Security = require('../../../../src/lib/helpers/security');
const CleanTests = require('../cleanTests');
const ErrorTests = require('../errorTests');
const Messages = require('../../../../src/lib/messages');
const MongoDb = require('../../../../src/lib/helpers/mongoDb');

describe('lib/data/users/users.service.deleteById', () => {

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
    await create();
  });

  after(async () => {
    await CleanTests.cleanUser(user.username);
  });

  const create = async () => {
    user.hash = Security.createHash('testing');
    const result = await Db.add(user, null, Schema);
    if (result) {
      userId = result._id.toString();
    }
    delete user.hash;
  }

  it('deleteById', async () => {
    const auth = {
      id: 'this-is-an-user-id',
      firstName: 'User',
      admin: true
    }
    const result = await Users.deleteById(auth, userId);
    assert.equal(_.isObject(result), true, 'Must return an object value');
    assert.equal(!_.isEmpty(result._id), true, 'Contains expected fields: id. This field is added by MongoDB.');
    assert.equal(!_.isEmpty(result.username), true, 'Contains expected fields: username');
    assert.equal(_.isEmpty(result.hash), true, 'May not return the hash field');
    return true;
  });

  it('deleteById as non-admin', async () => {
    const auth = {
      id: 'this-is-an-user-id',
      firstName: 'User',
      admin: false
    }
    return Users.deleteById(auth, userId).then((result) => {
      throw 'We expected an error!';
    }).catch((err) => {
      return ErrorTests.error(err, Messages.deletePermissionDenied);
    });
  });

  it('deleteById as non-admin with same id', async () => {
    await create();
    const auth = {
      id: userId,
      firstName: 'User',
      admin: false
    }
    const result = await Users.deleteById(auth, userId);
    assert.equal(_.isObject(result), true, 'Must return an object value');
    assert.equal(!_.isEmpty(result._id), true, 'Contains expected fields: id. This field is added by MongoDB.');
    assert.equal(!_.isEmpty(result.username), true, 'Contains expected fields: username');
    assert.equal(_.isEmpty(result.hash), true, 'May not return the hash field');
  });

  it('deleteById without admin in the auth token', async () => {
    const auth = {
      id: 'this-is-an-user-id',
      firstName: 'User'
    }
    return Users.deleteById(auth, userId).then((result) => {
      throw 'We expected an error!';
    }).catch((err) => {
      return ErrorTests.error(err, Messages.deletePermissionDenied);
    });
  });

  it('deleteById with null admin property', async () => {
    const auth = {
      id: 'this-is-an-user-id',
      firstName: 'User',
      admin: null
    }
    return Users.deleteById(auth, userId).then((result) => {
      throw 'We expected an error!';
    }).catch((err) => {
      return ErrorTests.error(err, Messages.deletePermissionDenied);
    });
  });

  it('deleteById without userId', async () => {
    const auth = {
      id: 'this-is-an-user-id',
      firstName: 'User',
      admin: true
    }
    return Users.deleteById(auth, null).then((result) => {
      throw 'We expected an error!';
    }).catch((err) => {
      return ErrorTests.error(err, Messages.idNotValid);
    });
  });

  it('deleteById with non-existing user', async () => {
    const auth = {
      id: 'this-is-an-user-id',
      firstName: 'User',
      admin: true
    }
    const nonExist = Mongoose.Types.ObjectId();
    return Users.deleteById(auth, nonExist).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      return ErrorTests.error(err, Messages.getNotFound);
    });
  });

  it('deleteById with non-objectID value', async () => {
    const auth = {
      id: 'this-is-an-user-id',
      firstName: 'User',
      admin: true
    }
    return Users.deleteById(auth, 'non-object-id').then((result) => {
      throw 'We expected an error!';
    }).catch((err) => {
      return ErrorTests.error(err, Messages.idNotValid);
    });
  });

});