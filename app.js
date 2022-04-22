require('dotenv').config();
const path = require('path');
// const bcrypt = require('bcrypt');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const FileStore = require('session-file-store')(expressSession);
const hbs = require('hbs');
const userData = require('./middleware/getAuthorization');

// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const { User } = require('./db/models');
const { sequelize } = require('./db/models');

const indexRouter = require('./routes/indexRouter');
const bookRouter = require('./routes/bookRouter');
const loginRouter = require('./routes/loginRouter');

const app = express();
const PORT = process.env.PORT ?? 3000;

const SECRET = 'keyboard cat';

const sessionConfig = {
  store: new FileStore(),
  secret: SECRET,
  cookie: {
    maxAge: 365 * 24 * 60 * 60 * 1000,
    path: '/',
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,
};

app.locals.title = 'Book collection';

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

app.use(cookieParser());
app.use(expressSession(sessionConfig));
app.use(userData);

// app.use(passport.initialize());
// app.use(passport.session());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Начало непонятной авторизации

// const auth = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     next();
//   } else {
//     return res.redirect('/');
//   }
// };

// const userDB = {
//   id: 1,
//   email: 'test@mail.ru',
//   password: '12345',
// };

// passport.serializeUser((user, done) => {
//   console.log('Сериализация: ', user);
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById({ where: id }, (err, user) => {
//     console.log('Десериализация: ', id);
//     // eslint-disable-next-line no-unused-expressions
//     err
//       ? done(err)
//       : done(null, user);
//   });
//   // console.log('Десериализация: ', id);
//   // const user = (userDB.id === id) ? userDB : false;
//   // done(null, user);
// });

// passport.use(new LocalStrategy(
//   {
//     usernameField: 'email',
//     passwordField: 'password',
//   },
//   (email, password, done) => {
//     // eslint-disable-next-line no-nested-ternary
//     User.findOne({ where: { email } }, (err, user) => (err
//       ? done(err)
//       // eslint-disable-next-line no-nested-ternary
//       : user
//         ? password === user.password
//           ? done(null, user)
//           : done(null, false, { message: 'Incorrect password.' })
//         : done(null, false, { message: 'Incorrect username.' })));
//     // if (email === userDB.email && password === userDB.password) {
//     //   return done(null, userDB);
//     // }
//     // return done(null, false);
//   },
// ));

// Конец непонятной авторизации

app.use('/', indexRouter);
app.use('/books', bookRouter);
app.use('/login', loginRouter);

app.get('*', (req, res) => {
  res.redirect('/');
});

app.listen(PORT, async () => {
  /* eslint-disable no-console */
  console.log(`The server is listening on port ${PORT}...`);

  try {
    await sequelize.authenticate({ logging: false });
    console.log('Connecting to the database successfully');
  } catch (error) {
    console.log('Failed to connect to DB');
    console.log(error.message);
  }
  /* eslint-enable */
});
