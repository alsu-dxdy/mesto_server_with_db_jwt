const router = require('express').Router();
// eslint-disable-next-line object-curly-newline
const { getUsers, getUserById, createUser, removeUserdById, updateUser, updateAvatarUser } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.delete('/:userId', removeUserdById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatarUser);


module.exports = router;
