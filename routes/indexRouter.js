const router = require('express').Router();
require('../config-passport');

router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;
