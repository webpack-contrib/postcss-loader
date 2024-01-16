/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  transform: {
    "\\.[mc]?tsx?$": ["ts-jest", { rootDir: ".", esModuleInterop: true }],
    "\\.[mc]?jsx?$": "babel-jest",
  },
  // ignore node_modules except for strip-ansi and ansi-regex
  transformIgnorePatterns: ["node_modules/(?!strip-ansi|ansi-regex)"],
};
