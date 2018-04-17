const Descriptor = require('./lib/descriptor')
const Joi = require('joi')
const stream = require('stream')

module.exports = Envie
Envie.Envie = Envie
Envie.Joi = Joi

function Envie (description, values, options) {
  if (!(this instanceof Envie)) return new Envie(description, values, options)
  if (!values) values = process.env
  if (!options) options = { noDefaults: false }

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

  this.helpString = function () {
    return Object.keys(description)
      .map((key) => Descriptor.description(key, description[key], values[key]))
      .join("\n")
  }
  this.displayHelp = function (target) {
    if (!target) target = process.stderr
    return contentStream(this.helpString()).pipe(target)
  }

  this.validate = () => {
    const { error } = Joi.validate(values, description, { allowUnknown: true })
    if (error) throw error
  }

  function validate (key) {
    return getValidator(key).validate(values[key], { noDefaults: options.noDefaults })
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

function contentStream(content) {
  const result = stream.PassThrough()
  result.end(content)
  return result
}
