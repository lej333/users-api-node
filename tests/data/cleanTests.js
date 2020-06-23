const UserSchema = require('../../../src/lib/data/users/users.model');
const VacancySchema = require('../../../src/lib/data/vacancies/vacancies.model');
const MongoDb = require('../../../src/lib/helpers/mongoDb');

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

const cleanVacancy = async (title) => {
  const search = {
    title: title
  };
  const Db = MongoDb.db(VacancySchema);
  const result = await Db.search(search, null, null);
  if (result && result.length !== 0) {
    await Db.deleteById(result[0].id, null);
  }
  return true;
};

const cleanVacancyById = async (vacancyId) => {
  const Db = MongoDb.db(VacancySchema);
  await Db.deleteById(vacancyId, null);
  return true;
};

module.exports = {
  cleanUser,
  cleanVacancy,
  cleanVacancyById
};