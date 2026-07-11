const dotenv = require('dotenv');
const path = require('path');

const envPath = path.join(__dirname, '../../.env');
const envLoadResult = dotenv.config({ path: envPath });

if (envLoadResult.error && process.env.NODE_ENV !== 'production') {
  console.warn(
    '[Config Warning]: .env file was not found. Using system environment variables instead.'
  );
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
};
