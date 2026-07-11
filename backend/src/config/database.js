const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

const connectDatabase = async () => {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is missing');
  }

  const connection = await mongoose.connect(MONGODB_URI);
  console.log(`MongoDB Connected: ${connection.connection.host}`);
};

module.exports = connectDatabase;
