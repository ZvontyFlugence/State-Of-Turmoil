const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');
const AuthService = require('../services/AuthService');
const MemberService = require('../services/MemberService');

router.get('/validate', auth, async (req, res) => {
  // If this is actually reached, then the token has already
  // been confirmed to be valid
  const users = db.getDB().collection('users');
  const user = await users.findOne({ _id: req.user_id });
  return res.status(202).json({ result: 'valid', user });
});

router.post('/login', async (req, res) => {
  const hasEmail = req.body.hasOwnProperty('email');
  const hasPassword = req.body.hasOwnProperty('password');

  if (!hasEmail || !hasPassword) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const { email, password } = req.body;
  let login_result = await AuthService.login(email, password);
  return res.status(login_result.status_code).json({ ...login_result.payload });
});

router.post('/register', async (req, res) => {
  let user = await MemberService.createUser(req.body);
  if (user) {
    return res.status(201).json({ created: true });
  } else {
    return res.status(500).json({ error: 'Failed to Create User' });
  }
});

module.exports = router;
