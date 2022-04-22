const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('./db/models');

const userDB = {
  id: 1,
  email: 'test@mail.ru',
  password: '12345',
};

passport.serializeUser((user, done) => {
  console.log('Сериализация: ', user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById({ where: id }, (err, user) => {
    console.log('Десериализация: ', id);
    // eslint-disable-next-line no-unused-expressions
    err
      ? done(err)
      : done(null, user);
  });
  // console.log('Десериализация: ', id);
  // const user = (userDB.id === id) ? userDB : false;
  // done(null, user);
});

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  (email, password, done) => {
    // eslint-disable-next-line no-nested-ternary
    User.findOne({ where: { email } }, (err, user) => (err
      ? done(err)
      // eslint-disable-next-line no-nested-ternary
      : user
        ? password === user.password
          ? done(null, user)
          : done(null, false, { message: 'Incorrect password.' })
        : done(null, false, { message: 'Incorrect username.' })));
    // if (email === userDB.email && password === userDB.password) {
    //   return done(null, userDB);
    // }
    // return done(null, false);
  },
));
