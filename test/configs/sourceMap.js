test('Source Maps', () => {
  const css = require('../fixtures/style.css')
  expect(css).toEqual('a { color: black }\n')
})
