/**
 * This test tests the authenticate function in users service model.
 * The tests which will be created in this test will be erased after.
 */
process.env.NODE_ENV = 'test';

const Boom = require('@hapi/boom');
const assert = require('assert');
const _ = require('lodash');

const Init = require('../../../../src');
const Users = require('../../../../src/lib/data/users/users.service');
const Schema = require('../../../../src/lib/data/users/users.model');
const Security = require('../../../../src/lib/helpers/security');
const CleanTests = require('../cleanTests');
const MongoDb = require('../../../../src/lib/helpers/mongoDb');

describe('lib/data/users/users.service.authenticate', () => {

  const Db = MongoDb.db(Schema);

  const user = {
    username: 'test user',
    password: 'testing',
    admin: false,
    firstName: 'Test',
    namePrefix: '',
    lastName: 'User',
    hash: Security.createHash('testing')
  }

  before(async () => {
    await CleanTests.cleanUser(user.username);
    await Db.add(user, null, Schema);
  });

  after(async () => {
    await CleanTests.cleanUser(user.username);
  });

  it('authenticate', async () => {
    const result = await Users.authenticate(user.username, user.password);
    assert.equal(_.isObject(result), true, 'Must return an object value');
    assert.equal(!_.isEmpty(result._id), true, 'Contains expected fields: id. This field is added by MongoDB.');
    assert.equal(!_.isEmpty(result.username), true, 'Contains expected fields: username');
    assert.equal(_.isEmpty(result.hash), true, 'May not return the hash field');
    assert.equal(result.username, user.username, 'The username have to be equal as before creation');
    return true;
  });

  it('authenticate with wrong password', async () => {
    return Users.authenticate(user.username, 'this is a wrong password').then((result) => {
      throw 'We expected an error!';
    }).catch((err) => {
      assert.equal(Boom.isBoom(err), true, 'Expects a Boom error');
      assert.equal(err.message, 'Failed to login with the given username and password', 'Expects failed login error message');
      return true;
    });
  });

  it('authenticate with null password', async () => {
    return Users.authenticate(user.username, null).then((err) => {
      throw 'We expected an error!';
    }).catch((err) => {
      assert.equal(Boom.isBoom(err), true, 'Expects a Boom error');
      assert.equal(err.message, 'Failed to login with the given username and password', 'Expects failed login error message');
      return true;
    });
  });

  it('authenticate with empty password', async () => {
    return Users.authenticate(user.username, '').then((result) => {
      throw 'We expected an error!';
    }).catch((err) => {
      assert.equal(Boom.isBoom(err), true, 'Expects a Boom error');
      assert.equal(err.message, 'Failed to login with the given username and password', 'Expects failed login error message');
      return true;
    });
  });

  it('authenticate with undefined password', async () => {
    return Users.authenticate(user.username, undefined).then((result) => {
      throw 'We expected an error!';
    }).catch((err) => {
      assert.equal(Boom.isBoom(err), true, 'Expects a Boom error');
      assert.equal(err.message, 'Failed to login with the given username and password', 'Expects failed login error message');
      return true;
    });
  });

  it('authenticate with unknown username', async () => {
    return Users.authenticate('this-is-absolute-unknown-user', user.password).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      assert.equal(Boom.isBoom(err), true, 'Expects a Boom error');
      assert.equal(err.message, 'Failed to login with the given username and password', 'Expects failed login error message');
      return true;
    });
  });

  it('authenticate with null username', async () => {
    return Users.authenticate(null, user.password).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      assert.equal(Boom.isBoom(err), true, 'Expects a Boom error');
      assert.equal(err.message, 'Failed to login with the given username and password', 'Expects failed login error message');
      return true;
    });
  });

  it('authenticate with empty username', async () => {
    return Users.authenticate('', user.password).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      assert.equal(Boom.isBoom(err), true, 'Expects a Boom error');
      assert.equal(err.message, 'Failed to login with the given username and password', 'Expects failed login error message');
      return true;
    });
  });

  it('authenticate with undefined username', async () => {
    return Users.authenticate(undefined, user.password).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      assert.equal(Boom.isBoom(err), true, 'Expects a Boom error');
      assert.equal(err.message, 'Failed to login with the given username and password', 'Expects failed login error message');
      return true;
    });
  });

});