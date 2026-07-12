const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const connectDatabase = require('../src/config/database');

/**
 * Global Jest setup.
 *
 * Prepares the testing environment by connecting to the MongoDB database
 * and clearing collections between test runs to ensure state isolation.
 */
beforeAll(async () => {
  await connectDatabase();
});

afterEach(async () => {
  // Reset/clean database collections between runs to guarantee isolation
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

afterAll(async () => {
  // Disconnect mongoose database connection if established
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});
