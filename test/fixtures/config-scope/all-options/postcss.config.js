const path = require('path');

module.exports = () => ({
  from: path.resolve(__dirname, '../../sss/style.sss'),
  to: path.resolve(__dirname, '../../sss/style.css'),
  parser: 'sugarss',
  map: {
    inline: true,
    annotation: true,
  },
  plugins: [
    ['postcss-short', { prefix: 'x' }]
  ]
});
