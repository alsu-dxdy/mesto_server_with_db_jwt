require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const auth = require('./middlewares/auth');

const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  //autoIndex: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/signin', login);
app.post('/signup', createUser);

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

app.use((err, req, res, next) => {
  let status = err.status || 500;
  let { message } = err;
  if (err.name === 'ValidationError') {
    return res.status(400).send('ValidationError');
  }

  if (err.message.includes("owner of this card")) {
    status = 403;
  }

  if (status === 500) {
    console.error(err.stack || err);
    message = 'unexpected error';
  }
  res.status(status).send(message);
});