// http://json-schema.org/learn/getting-started-step-by-step.html

const schema = {
  "type": "object",
  "properties": {
    "host": {
      "description": "Host",
      "type": "string"
    },
    "port": {
      "description": "Port",
      "type": "number"
    },
    "password": {
      "description": "Password",
      "type": "string",
    }
  },
  "required": [ "host", "port" ]
}

module.exports = schema
