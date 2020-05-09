// импортируем модель
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return next({ status: 404, message: `Card with ID ${req.params.cardId} does not exist` });
      }
      res.json(card);
    })
    .catch((err) => {
      next(err);
    });
  //  next();
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.message === 'ENOTFOUND') {
        return next({ status: 404, message: 'Card file not found' });
      }
      next(err);
    });
};

module.exports.removeCardById = (req, res, next) => {
  Card
    .findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        // если карта не нашлась
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({
          status: 404,
          message: `Card with ID ${req.params.cardId} does not exist`,
        });
      }
      const { owner } = card;
      return owner;
    })
    .then((owner) => {
      if (req.user._id === owner.toString()) {
        return Card.findByIdAndRemove(req.params.cardId);
      }
      // если владельцы не совпали
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        status: 403,
        message: 'You are not owner of this card, therefore you can not delete this card',
      });
    })
    .then(() => {
      res.send(`Card with ID ${req.params.cardId} is deleted`);
    })
    .catch((err) => {
      next(err);
    });
};

// eslint-disable-next-line no-unused-vars
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((like) => res.send({ data: like }))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// eslint-disable-next-line no-unused-vars
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((like) => res.send({ data: like }))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
