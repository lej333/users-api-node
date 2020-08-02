const UserSchema = require('../../../../src/lib/data/users.model');
const MongoDb = require('../../../../src/lib/helpers/mongoDb');

const cleanUser = async (username) => {
  const search = {
    username: username
  };
  const Db = MongoDb.db(UserSchema);
  const result = await Db.search(search, null, null);
  if (result && result.length !== 0) {
    await Db.deleteById(result[0].id, null);
  }
  return true;
};

module.exports = {
  cleanUser
};