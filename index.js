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

  this.displayHelp = function (target) {
    if (!target) target = process.stderr
    const result = SS({ separator: '\n' })
    Object.keys(description)
      .map((key) => Descriptor.description(key, description[key], values[key]))
      .forEach((description) => result.write(description))
    result.end()
    return result.pipe(target)
  }

  this.validate = () => {
    const { error } = Joi.validate(values, description, { allowUnknown: true })
    if (error) throw error
  }

  function validate (key) {
    return getValidator(key).validate(values[key])
  }

  function getValidator (key) {
    const keyDescription = description[key]
    if (keyDescription && keyDescription.isJoi) {
      return keyDescription
    }
    const keyValue = keyDescription

    if (typeof keyValue === 'number') {
      return Joi.number().default(keyValue)
    } else if (typeof keyValue === 'boolean') {
      return Joi.boolean().default(keyValue)
    } else if (typeof keyValue === 'string' && !/\s/.test(keyValue)) {
      return Joi.string().default(keyValue)
    } else {
      return Joi.any()
    }
  }
}
