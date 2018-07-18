
const mainConfig = require('./jest.json')

module.exports = Object.assign(mainConfig, {
  "testRegex": "storybook/storyshots\\.ts$",
  "collectCoverage": false,
})
