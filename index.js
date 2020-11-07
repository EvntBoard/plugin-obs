const moduleOBS = require('./module')

const params = {
  host: 'string',
  port: 'number',
  password: 'string',
}

module.exports = {
  name: 'OBS',
  type: 'obs',  // this going to be in trigger !
  description: 'OBS module',
  module: moduleOBS,
  params,
}