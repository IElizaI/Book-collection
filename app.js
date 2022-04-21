require('dotenv').config();
const path = require('path');
const bcrypt = require('bcrypt');
const express = require('express');
const passport = require('passport');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const FileStore = require('session-file-store')(expressSession);
const hbs = require('hbs');
// const { sequelize } = require('./db/models');
const indexRouter = require('./routes/indexRouter');
const bookRouter = require('./routes/bookRouter');

const app = express();
const PORT = process.env.PORT ?? 3000;

const sessionConfig = {
  store: new FileStore(),
  secret: 'keyboard cat',
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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.getAuth = () => ({
    isAuthorized: req.session.isAuthorized,
    name: req.session.user?.name,
  });
  next();
});

app.use('/', indexRouter);
app.use('/books', bookRouter);

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
