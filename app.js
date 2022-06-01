require('dotenv').config();
const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const FileStore = require('session-file-store')(expressSession);
const hbs = require('hbs');
const { sequelize } = require('./db/models');

const indexRouter = require('./routes/indexRouter');
const bookRouter = require('./routes/bookRouter');
const loginRouter = require('./routes/loginRouter');
const registerRouter = require('./routes/registerRouter');
const logoutRouter = require('./routes/logoutRouter');
const decodeUserData = require('./middleware/decodeUserData');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
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
app.use(decodeUserData);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', bookRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);

app.get('*', (req, res) => {
  res.redirect('/');
});

io.on('connection', (socket) => {
  console.log('WS-соединение установлено');
  socket.on('chat:outgoing', (message) => {
    console.log('Client message', message);
    socket.broadcast.emit('chat:incoming', message);
  });
});

httpServer.listen(PORT, async () => {
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
