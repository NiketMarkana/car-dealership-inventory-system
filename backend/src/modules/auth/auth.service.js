const userRepository = require('./auth.repository');
const ConflictError = require('../../shared/errors/ConflictError');
const { ROLES } = require('./auth.constants');
const { AUTH_MESSAGES } = require('../../shared/constants/auth.messages');
const { hashPassword } = require('../../shared/utils/password');

const registerUser = async (userData) => {
    const { name, email, password } = userData;

    // Normalize email to ensure consistency in lookups and storage
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check whether email already exists
    const existingUser = await userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
        throw new ConflictError(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    // 2. Hash password using decoupled hashing utility
    const hashedPassword = await hashPassword(password);

    // 3. Create the user with default USER role
    const user = await userRepository.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: ROLES.USER,
    });

    return user;
};

module.exports = {
    registerUser,
};
