test('Plugins', () => {
  const css = require('../fixtures/style.css')
  expect(css).toEqual('a { color: rgba(255, 0, 0, 1.0) }\n')
})
