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

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
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
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, { new: true })
    .then((updatedUser) => res.send({ data: updatedUser }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.updateAvatarUser = (req, res) => {
  // eslint-disable-next-line max-len
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true })
    .then((updatedAvatarUser) => res.send({ data: updatedAvatarUser }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
