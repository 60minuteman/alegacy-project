const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [path.resolve(__dirname, './jest.setup.js')],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: false,
    }],
  },
  moduleDirectories: ['node_modules', 'src'],
};
