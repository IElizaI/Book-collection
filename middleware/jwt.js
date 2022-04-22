const JWT = require('../jwt');

const authCheck = (callback) => (req, res, next) => {
  const { token } = req.session;

  if (!token) {
    callback(req, res, next);
    return;
  }

  const userData = JWT.verify(token);

  if (!userData) {
    callback(req, res, next);
    return;
  }
  req.user = userData;

  next();
};

module.exports = authCheck;
