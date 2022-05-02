const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['.(interfaces|styles|schema|strategy).(ts)'],
};

module.exports = config;
