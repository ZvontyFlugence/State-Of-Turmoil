const db = require('../db');
const CountryService = require('./CountryService');

const RegionService = {};

// DEVELOPMENT ONLY
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

// DEVELOPMENT ONLY
RegionService.updateNeighbors = async data => {
  const regions = db.getDB().collection('regions');
  let region = await regions.findOne({ name: data.region });
  data.neighbors.sort();
  let neighbors = await Promise.all(data.neighbors.map(async regionName => {
    let r = await regions.findOne({ name: regionName }, { projection: { '_id': 1 } });
    return r._id;
  }));

  let updated = await regions.findOneAndUpdate({ _id: region._id }, { $set: { neighbors } });

  if (updated) {
    return Promise.resolve({ status: 200, payload: { updated: true } });
  }
  return Promise.reject({ status: 500, payload: { updated: false } });
}

RegionService.getDistance = async (src, dest) => {
  const regions = await RegionService.getAllRegions();
  let nodes = createNodes(regions);
  let _visited = dijkstras(nodes, nodes[src], nodes[dest]);
  let shortestPath = getShortestPath(nodes[dest]);
  return Promise.resolve({ path: shortestPath });
}

const createNodes = (regions) => {
  return regions.map(region => {
    region.distance = Infinity;
    region.visited = false;
    region.previous = null;
    region.borders = undefined;
    return region;
  });
}

const dijkstras = (nodes, srcNode, destNode) => {
  let visited = [];
  srcNode.distance = 0;
  let unvisited = getAllNodes(nodes);

  while (!!unvisited.length) {
    sortNodesByDistance(unvisited);
    let closest = getClosestNode(unvisited, destNode);

    if (closest.distance === Infinity)
      return visited;

    closest.visited = true;
    visited.push(closest);

    if (closest._id === destNode._id)
      return visited;

    updateUnvisitedNeighbors(closest, nodes);
  }
}

const getAllNodes = nodes => {
  let node_list = [];

  for (const node of nodes) {
    node_list.push(node);
  }

  return node_list;
}

const sortNodesByDistance = nodes => {
  nodes.sort((a, b) => a.distance - b.distance);
}

const getClosestNode = (nodes, destNode) => {
  let distance = nodes[0].distance;

  if (destNode.distance === distance)
    return destNode;
  else
    return nodes.shift();
}

const updateUnvisitedNeighbors = (node, nodes) => {
  let unvisitedNeighbors = getUnvisitedNeighbors(node, nodes);

  for (let neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previous = node;
  }
}

const getUnvisitedNeighbors = (node, nodes) => {
  let neighbors = [];

  for (let neighbor of node.neighbors) {
    if (nodes[neighbor-1]) {
      neighbors.push(nodes[neighbor-1]);
    }
  }

  return neighbors.filter(n => !n.visited);
}

const getShortestPath = (destNode) => {
  let shortestPath = [];
  let currNode = destNode;

  while (currNode !== null) {
    shortestPath.unshift(currNode);
    currNode = currNode.previous;
  }

  return shortestPath;
}

module.exports = RegionService;