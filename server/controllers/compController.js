const express = require('express');
const auth = require('../middleware/auth');
const CompService = require('../services/CompService');
const MemberService = require('../services/MemberService');
const router = express.Router();

router.get('/:id', auth, async (req, res) => {
  let comp_id = Number.parseInt(req.params.id);
  let company = await CompService.getCompany(comp_id);
  let ceo = await MemberService.getUser(company.ceo);

  company.ceo = ceo;

  if (company) {
    return res.status(200).json({ company });
  }
  return res.status(404).json({ error: 'Company Not Found' });
});

router.get('/ceo/:ceo', auth, async (req, res) => {
  let ceo_id = Number.parseInt(req.params.ceo);
  let companies = await CompService.getUserCompanies(ceo_id);

  if (companies) {
    return res.status(200).json({ companies });
  }
  return res.status(404).json({ error: 'User Companies Not Found' });
});

module.exports = router;
