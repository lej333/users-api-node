/**
 * This test tests the MongoDb helper class which contains functions to allow you to do CRUD actions on collections.
 * There are 6 basic functions to create/add, search, get one, delete one and update one in MongoDb collections.
 * This tests will use users collection for test purposes, all test data will be erased after.
 */
process.env.NODE_ENV = 'test';

const Boom = require('@hapi/boom');
const assert = require('assert');
const _ = require('lodash');
const Vault = require('schluessel');

const Init = require('../../../src');
const Users = require('../../src/lib/data/users/users.service');
const Schema = require('../../src/lib/data/users/users.model');
const Security = require('../../../src/lib/helpers/security');
const CleanTests = require('./helpers/cleanTests');
const ErrorTests = require('./helpers/errorTests');
const Messages = require('../../../src/lib/messages');
const MongoDb = require('../../../src/lib/helpers/mongoDb');

describe('lib/data/users/users.service.updateById', () => {

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

  it('update', async () => {
    const auth = {
      id: userId,
      firstName: 'User',
      admin: true
    }
    user.firstName = 'User';
    const result = await Users.updateById(auth, userId, user);
    assert.equal(_.isObject(result), true, 'Must return an object value');
    assert.equal(!_.isEmpty(result._id), true, 'Contains expected fields: id. This field is added by MongoDB.');
    assert.equal(!_.isEmpty(result.username), true, 'Contains expected fields: username');
    assert.equal(_.isEmpty(result.hash), true, 'May not return hash field');
    assert.equal(result.firstName, 'User', 'The first name have to be updated');
    user.firstName = 'Test';
    return true;
  });

  it('update as non-admin with same user id', async () => {
    const auth = {
      id: userId,
      firstName: 'User',
      admin: false
    }
    user.firstName = 'User2';
    const result = await Users.updateById(auth, userId, user);
    assert.equal(_.isObject(result), true, 'Must return an object value');
    assert.equal(!_.isEmpty(result._id), true, 'Contains expected fields: id. This field is added by MongoDB.');
    assert.equal(!_.isEmpty(result.username), true, 'Contains expected fields: username');
    assert.equal(_.isEmpty(result.hash), true, 'May not return hash field');
    assert.equal(result.firstName, 'User2', 'The first name have to be updated');
    user.firstName = 'Test';
    return true;
  });

  it('update as non-admin with different user id', async () => {
    const auth = {
      id: 'this-is-an-other-id',
      firstName: 'User',
      admin: false
    }
    return Users.updateById(auth, userId, user).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      return ErrorTests.error(err, Messages.updatePermissionDenied);
    });
  });

  it('update as admin with different user id', async () => {
    const auth = {
      id: 'this-is-an-other-id',
      firstName: 'User',
      admin: true
    }
    user.firstName = 'User3';
    const result = await Users.updateById(auth, userId, user);
    assert.equal(_.isObject(result), true, 'Must return an object value');
    assert.equal(!_.isEmpty(result._id), true, 'Contains expected fields: id. This field is added by MongoDB.');
    assert.equal(!_.isEmpty(result.username), true, 'Contains expected fields: username');
    assert.equal(_.isEmpty(result.hash), true, 'May not return hash field');
    assert.equal(result.firstName, 'User3', 'The first name have to be updated');
    user.firstName = 'Test';
    return true;
  });

  it('update without required field', async () => {
    const auth = {
      id: userId,
      firstName: 'User',
      admin: true
    }
    delete user.lastName;
    const result = await Users.updateById(auth, userId, user);
    assert.equal(_.isObject(result), true, 'Must return an object value');
    assert.equal(!_.isEmpty(result._id), true, 'Contains expected fields: id. This field is added by MongoDB.');
    assert.equal(!_.isEmpty(result.username), true, 'Contains expected fields: username');
    assert.equal(_.isEmpty(result.hash), true, 'May not return hash field');
    assert.equal(result.lastName, 'User', 'Last name have to be same after update');
    user.lastName = 'User';
    return true;
  });

  it('update with weak password', async () => {
    const auth = {
      id: userId,
      firstName: 'User',
      admin: true
    }
    user.password = 'very-weak';
    return Users.updateById(auth, userId, user).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      return ErrorTests.error(err, Messages.weakPassword);
    });
  });

  it('update with existing username', async () => {
    const auth = {
      id: userId,
      firstName: 'User',
      admin: true
    }
    const exists = _.clone(user);
    exists.username = 'existing-user';
    exists.hash = Security.createHash('testing');
    await Db.add(exists, null, Schema);

    user.username = exists.username;
    return Users.updateById(auth, userId, user).then(() => {
      throw 'We expected an error!';
    }).catch(async (err) => {
      await CleanTests.cleanUser(exists.username);
      user.username = 'test user';
      return ErrorTests.error(err, Messages.usernameNotUnique);
    });
  });

});