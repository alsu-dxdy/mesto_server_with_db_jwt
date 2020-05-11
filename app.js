/* eslint-disable no-shadow */
/* eslint-disable arrow-body-style */
/* eslint-disable consistent-return */
require('dotenv').config();
const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const schema = require('./schemas/signup');
const { validate } = require('./schemas/signup'); // for joi
const { PORT, DATABASE_URL } = require('./config');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});


// подключаем helmet
app.use(helmet());

// подключаем rate-limiter
app.use(limiter);

// подключаемся к серверу mongo
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  // autoIndex: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/signin', login);
app.post('/signup', validate(schema), createUser);


// авторизация
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));


app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  let { message } = err;

  if (err.message.includes('password') && err.message.includes('pattern')) {
    message = 'Password must include symbols only from range: [a-zA-Z0-9]';
    return res.status(400).send({ message });
  }

  if (err.name === 'ValidationError') {
    message = 'ValidationError';
    // message = err.details[0].message;
    return res.status(400).send({ message });
  }

  if (status === 500) {
    // eslint-disable-next-line no-console
    console.error(err.stack || err);
    message = 'unexpected error';
  }
  res.status(status).send({ message });
});
