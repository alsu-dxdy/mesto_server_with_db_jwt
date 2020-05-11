/* eslint-disable arrow-body-style */
const Joi = require('joi');

module.exports = Joi.object().keys({
  // module.exports.schema = Joi.object({
  name: Joi.string().required(),
  about: Joi.string().required(),
  avatar: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .required()
    .regex(/^[a-zA-Z0-9]{3,30}$/),
  // .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

module.exports.validate = (schema) => {
  return (req, res, next) => {
    Joi.validate(req.body, schema)
      .then(() => next())
      .catch((err) => {
        next(err);
      });
  };
};
