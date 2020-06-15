const axios = require('axios');
const jwt = require('jsonwebtoken');
const MemberService = require('./MemberService');

const AuthService = {};

AuthService.validate = async token => {
  return await jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return { type: 'invalid', error: 'Invalid Auth Token!' };
    } else {
      return { type: 'valid', user_id: decoded.user_id };
    }
  })
};

// Logs in a SoT user using their TS credentials
AuthService.login = async (email, password) => {
  // Forward Login Request to Turmoil Studios API
  let response = await axios.post(`${process.env.TS_API}/auth/login`, { email, password })
    .catch(err => err.response);
  
  const { data } = response;
  if (data.status_code === 200) {
    // Check user actually owns game
    if (!data.user.games.includes('SoT')) {
      // Build Error Response
      let payload = { error: 'You do not own State of Turmoil!' };
      return { status_code: 403, payload };
    } else {
      // Build Success Response
      let account = data.user.email;
      let user = await MemberService.getLinkedUser(account);
      let token = await jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      let payload = { token, user };
      return { status_code: 200, payload };
    }
  } else {
    // Return TS response
    return { status_code: data.status_code, payload: { error: data.error } };
  }
};

module.exports = AuthService;
