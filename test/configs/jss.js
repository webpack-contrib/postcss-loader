test('JSS', () => {
  const css = require('../fixtures/style.js')
  expect(css).toEqual('a {\n    color: yellow\n}')
})
