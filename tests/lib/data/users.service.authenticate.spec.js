/**
 * This test tests the authenticate function in users service model.
 * The tests which will be created in this test will be erased after.
 */
process.env.NODE_ENV = 'test';

const Boom = require('@hapi/boom');
const Assert = require('assert');
const _ = require('lodash');

const Init = require('../../../src');
const Users = require('../../../src/lib/data/users.service');
const Schema = require('../../../src/lib/data/users.model');
const Security = require('swalbe-library').Security;
const CleanTests = require('./helpers/cleanTests');
const MongoDb = require('../../../src/lib/helpers/mongoDb');
const Vault = require('schluessel');

describe('lib/data/users.service.authenticate', () => {

  const Db = MongoDb.db(Schema);

  const user = {
    username: 'test user',
    password: 'T3st!ngs',
    admin: false,
    active: true,
    contactName: 'Test User',
    companyName: 'Swalbe',
    passwordHash: Security.createHash('testing', Vault.cryptoKey)
  }

  before(async () => {
    await CleanTests.cleanUser(user.username);
    const result = await Db.add(user, null);
    console.log(result)
  });

  after(async () => {
    await CleanTests.cleanUser(user.username);
  });

  it('authenticate', async () => {
    const result = await Users.authenticate(user.username, user.password);
    Assert.equal(_.isObject(result), true, 'Must return an object value');
    Assert.equal(!_.isEmpty(result._id), true, 'Contains expected fields: id. This field is added by MongoDB.');
    Assert.equal(!_.isEmpty(result.username), true, 'Contains expected fields: username');
    Assert.equal(_.isEmpty(result.hash), true, 'May not return the hash field');
    Assert.equal(result.username, user.username, 'The username have to be equal as before creation');
    return true;
  });

  it('authenticate with wrong password', async () => {
    return Users.authenticate(user.username, 'this is a wrong password').then((result) => {
      throw 'We expected an error!';
    }).catch((err) => {
      Assert.equal(Boom.isBoom(err), true, 'Expects a Boom error');
      Assert.equal(err.message, 'Failed to login with the given username and password', 'Expects failed login error message');
      return true;
    });
  });

  it('authenticate with null password', async () => {
    return Users.authenticate(user.username, null).then((err) => {
      throw 'We expected an error!';
    }).catch((err) => {
      Assert.equal(Boom.isBoom(err), true, 'Expects a Boom error');
      Assert.equal(err.message, 'Failed to login with the given username and password', 'Expects failed login error message');
      return true;
    });
  });

  it('authenticate with empty password', async () => {
    return Users.authenticate(user.username, '').then((result) => {
      throw 'We expected an error!';
    }).catch((err) => {
      Assert.equal(Boom.isBoom(err), true, 'Expects a Boom error');
      Assert.equal(err.message, 'Failed to login with the given username and password', 'Expects failed login error message');
      return true;
    });
  });

  it('authenticate with undefined password', async () => {
    return Users.authenticate(user.username, undefined).then((result) => {
      throw 'We expected an error!';
    }).catch((err) => {
      Assert.equal(Boom.isBoom(err), true, 'Expects a Boom error');
      Assert.equal(err.message, 'Failed to login with the given username and password', 'Expects failed login error message');
      return true;
    });
  });

  it('authenticate with unknown username', async () => {
    return Users.authenticate('this-is-absolute-unknown-user', user.password).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      Assert.equal(Boom.isBoom(err), true, 'Expects a Boom error');
      Assert.equal(err.message, 'Failed to login with the given username and password', 'Expects failed login error message');
      return true;
    });
  });

  it('authenticate with null username', async () => {
    return Users.authenticate(null, user.password).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      Assert.equal(Boom.isBoom(err), true, 'Expects a Boom error');
      Assert.equal(err.message, 'Failed to login with the given username and password', 'Expects failed login error message');
      return true;
    });
  });

  it('authenticate with empty username', async () => {
    return Users.authenticate('', user.password).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      Assert.equal(Boom.isBoom(err), true, 'Expects a Boom error');
      Assert.equal(err.message, 'Failed to login with the given username and password', 'Expects failed login error message');
      return true;
    });
  });

  it('authenticate with undefined username', async () => {
    return Users.authenticate(undefined, user.password).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      Assert.equal(Boom.isBoom(err), true, 'Expects a Boom error');
      Assert.equal(err.message, 'Failed to login with the given username and password', 'Expects failed login error message');
      return true;
    });
  });

});