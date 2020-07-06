const express = require('express');
const auth = require('../middleware/auth');
const CompService = require('../services/CompService');
const router = express.Router();

router.get('/:id', auth, async (req, res) => {
  let comp_id = Number.parseInt(req.params.id);
  let company = CompService.getCompany(comp_id);

  if (company) {
    return res.status(200).json({ company });
  }
  return res.status(404).json({ error: 'Company Not Found' });
});

module.exports = router;
