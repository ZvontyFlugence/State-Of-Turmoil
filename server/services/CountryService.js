const db = require('../db');

const CountryService = {};

CountryService.getCountry = async id => {
  const countries = db.getDB().collection('countries');
  return await countries.findOne({ _id: id });
}

module.exports = CountryService;