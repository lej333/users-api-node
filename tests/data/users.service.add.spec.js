/**
 * This test tests the add function in users service model.
 * The tests which will be created in this test will be erased after.
 */
process.env.NODE_ENV = 'test';

const Chai = require('chai');
const Assert = Chai.assert;

const Init = require('../../../../src');
const Users = require('../../../../src/lib/data/users/users.service');
const CleanTests = require('../cleanTests');
const ErrorTests = require('../errorTests');
const Messages = require('../../../../src/lib/messages');

describe('lib/data/users/users.service.add', () => {

  const user = {
    username: 'test user',
    password: 'T3st!ngs',
    admin: false,
    firstName: 'Test',
    namePrefix: '',
    lastName: 'User'
  }
  const auth = {
    id: 'this-is-an-user-id',
    firstName: 'User',
    admin: true
  }

  before(async () => {
    await CleanTests.cleanUser(user.username);
  });

  after(async () => {
    await CleanTests.cleanUser(user.username);
  });

  const success = (result) => {
    Assert.isObject(result, 'Must return an object value');
    Assert.isDefined(result._id, 'Object must contain id property which were created by MongoDb automatically');
    Assert.isDefined(result.username, 'Object must contain username property');
    Assert.isDefined(result.firstName, 'Object must contain firstName property');
    Assert.isDefined(result.namePrefix, 'Object must contain namePrefix property');
    Assert.isDefined(result.lastName, 'Object must contain lastName property');
    Assert.isDefined(result.admin, 'Object must contain admin property');
    Assert.isDefined(result.creationDate, 'Object must contain creationDate property');
    Assert.isDefined(result.creationUserId, 'Object must contain creationUserId property');
    Assert.isDefined(result.modifiedDate, 'Object must contain modifiedDate property');
    Assert.isDefined(result.modifiedUserId, 'Object must contain modifiedUserId property');
    Assert.isUndefined(result.hash, 'Object may not contain hash property');
    Assert.equal(result.username, user.username, 'The usernames have to be equal as before creation');
    Assert.isNull(result.modifiedDate, 'ModifiedDate property have to be null when were created newly');
    Assert.isNull(result.modifiedUserId, 'ModifiedUserId property have to be null when were created newly');
    Assert.isNotNull(result.creationDate, 'CreationDate have to be defined when created');
    Assert.typeOf(result.creationDate, 'date', 'CreationDate have to be filled with a date value');
    Assert.equal(result.firstName, user.firstName, 'The first names have to be equal as before creation');
    Assert.equal(result.namePrefix, user.namePrefix, 'The name prefixes have to be equal as before creation');
    Assert.equal(result.lastName, user.lastName, 'The last names have to be equal as before creation');
    Assert.equal(result.admin, user.admin, 'The admin property have to be equal as before creation');
  }

  it('add', async () => {
    const result = await Users.add(auth, user);
    return success(result);
  });

  it('add as non-admin', async () => {
    auth.admin = false;
    return Users.add(auth, user).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      auth.admin = true;
      return ErrorTests.error(err, Messages.addPermissionDenied);
    });
  });

  it('add without admin in the auth token', async () => {
    delete auth.admin;
    return Users.add(auth, user).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      auth.admin = true;
      return ErrorTests.error(err, Messages.addPermissionDenied);
    });
  });

  it('add with null admin property', async () => {
    auth.admin = null;
    return Users.add(auth, user).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      auth.admin = true;
      return ErrorTests.error(err, Messages.addPermissionDenied);
    });
  });

  it('add with same username', async () => {
    return Users.add(auth, user).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      return ErrorTests.error(err, Messages.usernameNotUnique);
    });
  });

  it('add with weak password', async () => {
    user.password = 'this-is-too-weak'
    return Users.add(auth, user).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      return ErrorTests.error(err, Messages.weakPassword);
    });
  });

});