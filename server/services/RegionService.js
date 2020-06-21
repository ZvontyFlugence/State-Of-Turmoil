const db = require('../db');
const CountryService = require('./CountryService');

const RegionService = {};

RegionService.getRegion = async id => {
  const regions = db.getDB().collection('regions');
  let region = await regions.findOne({ _id: id });
  let owner = await CountryService.getCountry(region.owner);

  region.owner = { _id: owner._id, name: owner.name, flag: owner.flag_code };

  return region;
}

RegionService.getAllRegions = async () => {
  const regions = db.getDB().collection('regions');
  return await regions.find({}).toArray();
}

RegionService.startingRegion = async country_id => {
  const regions = db.getDB().collection('regions');
  let region_list = await regions.find({ owner: country_id }).toArray();

  const index = Math.floor(Math.random() * region_list.length);

  return region_list[index];
}

module.exports = RegionService;