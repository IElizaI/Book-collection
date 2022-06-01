const router = require('express').Router();
const bcrypt = require('bcrypt');
const JWT = require('../jwt');
const { User } = require('../db/models');

router.get('/', (req, res) => {
  res.render('register', req.getAuth());
});

router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const createdUser = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const user = await User.findOne({ raw: true, where: { id: createdUser.id } });

    const { password: pass, ...otherUserData } = user;

    const token = JWT.sign(otherUserData);

    req.session.token = token;
    res.send({ success: true });
  } catch (error) {
    res.send({ success: false });
  }
});

module.exports = router;
