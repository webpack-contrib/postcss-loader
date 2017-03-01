// TODO
test.skip('Validation Error', () => {
  const css = require('../fixtures/style.css')
  expect(css).toThrowError()
})
