test('Exec', () => {
  const css = require('../fixtures/style.exec.js')
  expect(css).toEqual(`a {\n    color: green\n}`)
})
