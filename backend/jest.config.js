/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!src/server.js', '!src/config/**'],
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  verbose: true,
};

module.exports = config;
