const User = require('./auth.model');

/**
 * Find user by email address.
 * @param {string} email
 * @returns {Promise<User|null>}
 */
const findByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Create a new user in the database.
 * @param {Object} userData
 * @returns {Promise<User>}
 */
const create = async (userData) => {
  return User.create(userData);
};

/**
 * Find user by ID.
 * @param {string} id
 * @returns {Promise<User|null>}
 */
const findById = async (id) => {
  return User.findById(id);
};

module.exports = {
  findByEmail,
  create,
  findById,
};
