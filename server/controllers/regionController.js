const express = require('express');
const auth = require('../middleware/auth');
const RegionService = require('../services/RegionService');
const router = express.Router();;

// Get All Regions
router.get('/', auth, async (req, res) => {
  let regions = await RegionService.getAllRegions();

  if (regions) {
    return res.status(200).json({ regions });
  }
  return res.status(500).json({ error: 'Something Unexpected Happened' });
});

// Get Specific Region
router.get('/:id', auth, async (req, res) => {
  const id = Number.parseInt(req.params.id);
  let region = await RegionService.getRegion(id);

  if (region) {
    return res.status(200).json({ region });
  }
  return res.status(404).json({ error: 'Region Not Found' });
});

// Creates a new region
// DEVELOPMENT ONLY
router.post('/', async (req, res) => {
  let region = await RegionService.createRegion(req.body);

  if (region) {
    return res.status(200).json({ success: true });
  }
  return res.status(500).json({ success: false });
});

// UPDATES REGIONS NEIGHBORS
// DEVELOPMENT ONLY
router.post('/neighbors', async (req, res) => {
  let result = await RegionService.updateNeighbors(req.body);
  return res.status(result.status).json(result.payload);
});

router.post('/travel-distance', async (req, res) => {
  if (!req.body.hasOwnProperty('src') || !req.body.hasOwnProperty('dest')) {
    return res.status(400).json({ error: 'Invalid Travel Information' });
  }

  let {src, dest} = req.body;

  if (src === dest) {
    return res.status(400).json({ error: 'Already Located In Target Region' });
  }

  let result = await RegionService.getDistance(src - 1, dest - 1);
  if (result) {
    return res.status(200).json({ ...result });
  }
  return res.status(500).json({ error: 'Something Went Wrong' });
})

module.exports = router;