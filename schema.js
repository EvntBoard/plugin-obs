const Joi = require('joi')

const schema = Joi.object({
  host: Joi.string().required(),
  port: Joi.number().required(),
  password: Joi.string().required(),
})

module.exports = schema
