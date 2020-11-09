const moduleOBS = require('./module')

const params = {
  host: 'string',
  port: 'number',
  password: 'string',
}

module.exports = {
  evntboard: 'obs',
  name: 'OBS',
  description: 'OBS module',
  module: moduleOBS,
  params,
}
