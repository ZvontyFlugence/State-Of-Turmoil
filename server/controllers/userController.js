const express = require('express');
const auth = require('../middleware/auth');
const MemberService = require('../services/MemberService');
const CountryService = require('../services/CountryService');
const RegionService = require('../services/RegionService');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const user = await MemberService.getUser(req.user_id);

  if (user) {
    return res.status(200).json({ user });
  }
  return res.status(404).json({ error: 'User Not Found' });
});

router.get('/all', auth, async (req, res) => {
  let result = await MemberService.getAllUsers();
  return res.status(result.status).json(result.payload);
});

router.get('/location-info', auth, async (req, res) => {
  const user = await MemberService.getUser(req.user_id);
  // Get CS Info
  const csCountry = await CountryService.getCountry(user.country);
  // Get Region Info
  const region = await RegionService.getRegion(user.location);
  const regionOwner = await CountryService.getCountry(region.owner);

  let country_info = { name: csCountry.name, flag: csCountry.flag_code };
  let region_info = {
    name: region.name,
    owner: region.owner,
    owner_name: regionOwner.name,
    owner_flag: regionOwner.flag_code
  };

  if (csCountry && region && regionOwner) {
    return res.status(200).json({ country_info, region_info });
  } else {
    return res.status(500).json({ error: 'Failed to get user\'s location info' });
  }
});

router.get('/wallet-info', auth, async (req, res) => {
  const user = await MemberService.getUser(req.user_id);
  const region = await RegionService.getRegion(user.location);
  const regionOwner = await CountryService.getCountry(region.owner);

  let curr_cc = user.wallet.filter(cc => cc.currency === regionOwner.currency)[0];
  curr_cc.flag = regionOwner.flag_code;

  // TODO: Add flags for other currencies (for Profile Page)

  let wallet_info = {
    current: curr_cc,
    currencies: user.wallet,
  };

  if (region && regionOwner) {
    return res.status(200).json({ wallet_info });
  }
  return res.status(500).json({ error: 'Failed to get user\'s wallet info' });
});

router.patch('/action', auth, async (req, res) => {
  if (!req.body.hasOwnProperty('action')) {
    return res.status(400).json({ error: 'No Action Provided' });
  }

  let result = await MemberService.doAction(req.user_id, req.body);
  return res.status(result.status).json(result.payload);
});

router.get('/:id', auth, async (req, res) => {
  let id = Number.parseInt(req.params.id);
  const profile = await MemberService.getUser(id);
  const country = await CountryService.getCountry(profile.country);
  const region = await RegionService.getRegion(profile.location);
  const regionOwner = await CountryService.getCountry(region.owner);

  profile.country_info = {
    id: country._id,
    name: country.name,
    flag: country.flag_code,
  };

  profile.location_info = {
    id: region._id,
    name: region.name,
    owner: {
      id: regionOwner._id,
      name: regionOwner.name,
      nick: regionOwner.nick,
      flag: regionOwner.flag_code,
    }
  };
  
  if (profile) {
    return res.status(200).json({ profile });
  }
  return res.status(404).json({ error: 'Profile Not Found' });
});

module.exports = router;