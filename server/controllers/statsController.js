const express = require('express');
const auth = require('../middleware/auth');
const StatsService = require('../services/StatsService');
const router = express.Router();

router.patch('/citizens', auth, async (req, res) => {
  if (!req.body.hasOwnProperty('stat')) {
    return res.status(400).json({ error: 'No Sorting Stat Provided' });
  }

  let result = await StatsService.citizenStats(req.body);
  return res.status(result.status).json(result.payload);
});

module.exports = router;