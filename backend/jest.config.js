export default {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  collectCoverageFrom: ['src/**/*.js'],
};
