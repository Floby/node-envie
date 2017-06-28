const Joi = require('joi')

module.exports = Envie

function Envie (description, values) {
  if (!(this instanceof Envie)) return new Envie(description, values)

  this.get = function (key) {
    const { error, value } = validate(key)
    if (error) {
      throw Error(`${key} is not valid: ${error.message}`)
    }
    return value
  }

  this.has = function (key) {
    const { error, value } = validate(key)
    return error ? false : values.hasOwnProperty(key)
  }

  this.validate = () => true

  function validate (key) {
    const validator = description[key] || Joi.any()
    return validator.validate(values[key])
  }
}
