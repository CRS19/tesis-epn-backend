const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '.(guard|decorator|interfaces|styles|schema|strategy).(ts)',
  ],
};

module.exports = config;
