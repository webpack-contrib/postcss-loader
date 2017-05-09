test('Syntax', () => {
  const css = require('../fixtures/style.sss')
  expect(css).toEqual('a\n  color: black\n')
})
