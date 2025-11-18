/** @type {import('jest').Config} */
const config = {
  // The environment in which the tests are run. For a Node.js server, this should be 'node'.
  testEnvironment: "node",

  // Automatically clear mock calls, instances, and results before every test.
  // This helps to ensure that tests are isolated from each other.
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test.
  collectCoverage: true,

  // The directory where Jest should output its coverage files.
  coverageDirectory: "coverage",

  // A list of glob patterns indicating a set of files for which coverage information should be collected.
  // We want to include all JavaScript files but exclude node_modules and the coverage directory itself.
  collectCoverageFrom: ["**/*.js", "!**/node_modules/**", "!coverage/**"],
};

module.exports = config;
