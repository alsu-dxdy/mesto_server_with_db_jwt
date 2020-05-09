const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

// импортируем модель
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return next({ status: 404, message: 'User with this ID does not exist' });
      }
      res.json(user);
    })
    .catch((err) => {
      next(err);
    });
};

// eslint-disable-next-line consistent-return
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (password.length < 8) {
    return next({
      status: 400,
      message: 'minlength of password must be 8',
    });
  }
  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash, // записываем хеш в базу
    }))
    .then((user) => {
      res.status(201).send({ _id: user._id, email: user.email });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.message === 'ENOTFOUND') {
        return next({ status: 404, message: 'User file not found' });
      }
      next(err);
    });
};

module.exports.removeUserdById = (req, res, next) => {
  User.findByIdAndRemove(req.params.userId)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return next({ status: 404, message: 'User with this ID does not exist' });
      }
      res.send('User is deleted');
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUser = (req, res) => {
  // eslint-disable-next-line max-len
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    {
      new: true, // передать обновлённый объект на вход обработчику then
      runValidators: true, // валидировать новые данные перед записью в базу
    },
  )
    .then((updatedUser) => res.send({ data: updatedUser }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.updateAvatarUser = (req, res) => {
  // eslint-disable-next-line max-len
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true, // передать обновлённый объект на вход обработчику then
      runValidators: true, // валидировать новые данные перед записью в базу
    },
  )
    .then((updatedAvatarUser) => res.send({ data: updatedAvatarUser }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((newUser) => {
      // не нашелся - отклоняем промис
      if (!newUser) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // нашелся - сравниваем хеши
      return bcrypt.compare(password, newUser.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          const token = jwt.sign(
            { _id: newUser._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );
          return res.send({ token });
        });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
