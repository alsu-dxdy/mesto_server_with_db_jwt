// eslint-disable-next-line no-unused-vars
const validator = require('validator');

// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: [validator.isURL, 'invalid URL'],
  },
});

module.exports = mongoose.model('user', userSchema);
