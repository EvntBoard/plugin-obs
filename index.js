const moduleOBS = require('./module')
const schema =  require('./schema')

module.exports = {
  evntboard: 'obs',
  name: 'OBS',
  description: 'OBS module',
  module: moduleOBS,
  schema,
}
