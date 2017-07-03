const SS = require('stream-stream')
const Descriptor = require('./lib/descriptor')
const Joi = require('joi')

module.exports = Envie
Envie.Envie = Envie
Envie.Joi = Joi

function Envie (description, values) {
  if (!(this instanceof Envie)) return new Envie(description, values)
  if (!values) values = process.env

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

  this.displayHelp = function (target) {
    if (!target) target = process.stderr
    const result = SS({ separator: '\n' })
    Object.keys(description)
      .map((key) => Descriptor.description(key, description[key], values[key]))
      .forEach((description) => result.write(description))
    return result.pipe(target)
  }

  function validate (key) {
    return getValidator(key).validate(values[key])
  }

  function getValidator (key) {
    return description[key] || Joi.any()
  }
}
