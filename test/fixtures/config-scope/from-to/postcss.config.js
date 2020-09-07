module.exports = {
  from: '../../css/style.css',
  to: '../../css/style.css',
  map: {
    inline: false,
    annotation: false,
    sourcesContent: true,
  },
  plugins: [
    ['postcss-short', { prefix: 'x' }]
  ]
};
