const config = require('./config')
const schema = require('./schema')
const plugin = require('./plugin')

module.exports = {
  id: 'obs',
  name: 'OBS for EvntBoard',
  description: 'OBS for EvntBoard',
  plugin,
  schema,
  config
}
