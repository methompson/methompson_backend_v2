module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.js', '**/*.test.ts', '**/**/*.test.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
    '@vice_bank/(.*)$': '<rootDir>/packages/vice_bank_submodule/src/$1',
  },
  testTimeout: 9000000,
};
