module.exports = {
  "parser": "sugarss",
  "syntax": "sugarss",
  "map": false,
  "from": "./test/rc-js/fixtures/index.css",
  "to": "./test/rc-js/expect/index.css",
  "plugins": [
    "postcss-import",
    ["postcss-nested", {}]
  ]
};
