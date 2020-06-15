const AuthService = require('../services/AuthService');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'No Auth Token!' });
  }

  const token = req.headers.authorization;
  let validation_result = await AuthService.validate(token);

  if (validation_result.type === 'invalid') {
    return res.status(403).json({ result: 'invalid', error: validation_result.error });
  }

  req.user_id = validation_result.user_id;

  next();
}