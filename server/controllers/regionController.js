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
router.post('/', async (req, res) => {
  let region = await RegionService.createRegion(req.body);

  if (region) {
    return res.status(200).json({ success: true });
  }
  return res.status(500).json({ success: false });
});

module.exports = router;