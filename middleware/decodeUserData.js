const JWT = require('../jwt');

const decodeUserData = (req, res, next) => {
  const { token } = req.session;
  if (token) {
    const data = JWT.decode(token);
    if (data) {
      req.user = data;
    }
  }

  req.getAuth = () => (req.user ? ({
    isAuthorized: Boolean(req.user),
    name: req.user?.name,
  }) : ({}));

  next();
};

module.exports = decodeUserData;
