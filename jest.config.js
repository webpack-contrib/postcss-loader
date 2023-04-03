/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  transform: {
    "\\.[mc]?tsx?$": ["ts-jest", { rootDir: ".", esModuleInterop: true }],
    "\\.[mc]?jsx?$": "babel-jest",
  },
};
