const router = require('express').Router();
// eslint-disable-next-line object-curly-newline
const { getCards, getCardById, createCard, removeCardById, likeCard, dislikeCard } = require('../controllers/cards');

router.get('/', getCards);
router.get('/:cardId', getCardById);
router.post('/', createCard);
router.delete('/:cardId', removeCardById);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
