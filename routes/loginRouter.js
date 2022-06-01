const router = require('express').Router();
const bcrypt = require('bcrypt');
const JWT = require('../jwt');
const { User } = require('../db/models');

router.get('/', (req, res) => {
  res.render('login', req.getAuth());
});

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ raw: true, where: { email } });

  if (user && (await bcrypt.compare(password, user.password))) {
    const { password: pass, ...otherUserData } = user;

    const token = JWT.sign(otherUserData);

    req.session.token = token;
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
});

module.exports = router;
