const Boom = require('@hapi/boom');
const Chai = require('chai');
const Assert = Chai.assert;

const error = (err, expectedMessage, expectedErrorCode) => {
  Assert.isTrue(Boom.isBoom(err), 'Expects a Boom error');
  Assert.equal(err.message, expectedMessage, 'Expects a correct error message');
  Assert.equal(err.errorCode, expectedErrorCode, 'Expects a correct error code');
  return true;
}

module.exports = {
  error
}