const db = require('../db');

const CountryService = {};

CountryService.getCountries = async () => {
  const countries = db.getDB().collection('countries');
  return await countries.find({}).toArray();
}

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

CountryService.getPopulation = async id => {
  let citizens = await CountryService.getCitizens(id);

  if (citizens) {
    return Promise.resolve(citizens.length);
  }
  return Promise.resolve(0);
}

module.exports = CountryService;