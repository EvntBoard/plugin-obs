const Joi = require('joi')

const schema = Joi.object({
  host: Joi.string().hostname().required(),
  port: Joi.number().port().required(),
  password: Joi.string().allow('', null),
})

module.exports = schema
