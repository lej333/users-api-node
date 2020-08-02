/**
 * This test tests the schluessel vault package.
 * This package encrypts all sensitive credentials in a json file and decrypts it when requesting credentials in the code.
 * Based on the secret master key stored in credentials.{{env}}.key file in the root (never be published to git repos!!).
 */
process.env.NODE_ENV = 'test';

const Init = require('../../src');
const Vault = require('schluessel');
const assert = require('assert');
const _ = require('lodash');

describe('packages/schluessel', () => {

  it('Credentials', () => {
    assert.equal(_.isEmpty(Vault.authKey), false, 'The vault can`t be read!!');
    return true;
  });

});