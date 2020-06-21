const db = require('../db');

const CountryService = {};

CountryService.getCountry = async id => {
  const countries = db.getDB().collection('countries');
  return await countries.findOne({ _id: id });
}

CountryService.getCountryByFlagCode = async flag_code => {
  const countries = db.getDB().collection('countries');
  return await countries.findOne({ flag_code });
}

CountryService.getCitizens = async id => {
  const users = db.getDB().collection('users');
  return await users.find({ country: id }).toArray();
}

module.exports = CountryService;