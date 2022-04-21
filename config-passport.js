const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

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
  // User.findById(id, (err, user) => {
  //   err
  //     ? done(err)
  //     : done(null, user);
  // });
  console.log('Десериализация: ', id);
  const user = (userDB.id === id) ? userDB : false;
  done(null, user);
});

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    // User.findOne({ username }, (err, user) => {
    //   if (err) { return done(err); }
    //   if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
    //   if (!user.verifyPassword(password)) { return done(null, false, { message: 'Incorrect password.' }); }
    //   return done(null, user);
    // });
    if (email === userDB.email && password === userDB.password) {
      return done(null, userDB);
    }
    return done(null, false);
  },
));
