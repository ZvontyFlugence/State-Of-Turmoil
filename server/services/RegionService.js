const db = require('../db');

const RegionService = {};

RegionService.getRegion = async id => {
  const regions = db.getDB().collection('regions');
  return await regions.findOne({ _id: id });
}

RegionService.startingRegion = async country_id => {
  const regions = db.getDB().collection('regions');
  let region_list = await regions.find({ owner: country_id }).toArray();

  const index = Math.floor(Math.random() * region_list.length);

  return region_list[index];
}

module.exports = RegionService;