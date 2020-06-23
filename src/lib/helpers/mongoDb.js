/*
* Helper class for MongoDb connection to swalbe-mongodb npm package.
* Centralize registration to the vault and config.
* */
const Vault = require('schluessel');
const Config = require('../config');
const MongoDb = require('swalbe-mongodb');

const db = (schema) => {
  const mongoServer = Vault.mongoServer;
  const mongoOptions = Config.mongoDb.options
  return new MongoDb(schema, mongoServer, mongoOptions);
}

module.exports = {
  db
};