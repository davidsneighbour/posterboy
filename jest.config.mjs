/** @returns {Promise<import('jest').Config>} */
const jestConfig = async () => {
  return {
    "verbose": false,
    "testEnvironment": "node",
    "testMatch": [
      "**/?(*.)+(spec|test).mjs"
    ],
    "transform": {},
    "collectCoverage": true,
    "coverageDirectory": "coverage",
    "coverageReporters": ["html", "text"]
  }
}
export default jestConfig;
