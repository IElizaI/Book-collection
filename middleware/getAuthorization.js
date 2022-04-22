const userData = (req, res, next) => {
  req.getAuth = () => ({
    isAuthorized: Boolean(req.user),
    name: req.user?.name,
  });
  next();
};

module.exports = userData;
