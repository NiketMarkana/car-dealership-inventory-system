const bcrypt = require('bcrypt');

const { PASSWORD_SALT_ROUNDS } = require('../../config/env');

const hashPassword = async (password) => {
  return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
};

const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = {
  hashPassword,
  comparePassword,
};
