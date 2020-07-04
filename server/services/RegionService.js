const db = require('../db');
const CountryService = require('./CountryService');

const RegionService = {};

RegionService.createRegion = async data => {
  const regions = db.getDB().collection('regions');

  let region_doc = {
    _id: await regions.estimatedDocumentCount() + 1,
    name: data.name,
    owner: data.owner,
    core: data.core,
    resource: 0,
    neighbors: [],
  };

  if (!data.type) {
    region_doc["borders"] = data.borders.map(path => ({ lat: path[0], lng: path[1] }));
  } else {
    region_doc["type"] = data.type;
    region_doc["borders"] = data.borders.map(geom => {
      return geom.map(path => ({ lat: path[0], lng: path[1] }));
    });
  }

  return await regions.insertOne(region_doc);
}

RegionService.getRegion = async id => {
  const regions = db.getDB().collection('regions');
  let region = await regions.findOne({ _id: id });
  let core = await CountryService.getCountry(region.core);
  let owner = await CountryService.getCountry(region.owner);

  region.core = { _id: core._id, name: core.name, flag: core.flag_code };
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