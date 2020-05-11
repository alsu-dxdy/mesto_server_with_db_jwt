module.exports = {
  // eslint-disable-next-line radix
  PORT: parseInt(process.env.PORT) || 3000,
  DATABASE_URL: 'mongodb://localhost:27017/mestodb',
  // JWT_SECRET: process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret',
  // KEY_DEVELOP: 'dev-secret',
};

// eslint-disable-next-line max-len
// module.exports.JWT_SECRET = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret';
