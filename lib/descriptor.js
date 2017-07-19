require('colors')
const deep = require('deep-get-set')
const stream = require('stream')

exports.description = function (name, validator, value) {
  const descriptionStream = new stream.PassThrough()
  ; [nameAndTypeLine, descriptionLine, valueLine].forEach((lineFunction) => {
    const line = lineFunction(name, validator, value)
    if (line) descriptionStream.write(line)
  })
  descriptionStream.end('\n')
  return descriptionStream
}

function nameAndTypeLine (name, validator, value) {
  return `  ${name.bold.cyan}${annotation()}${defaultValue()}`

  function annotation () {
    if (validator._type === 'any') {
      return ''
    } else if (uriRules().length) {
      let type = 'uri'
      const schemes = uriRules()
        .filter((rule) => rule.arg && rule.arg.scheme)
        .map((rule) => rule.arg.scheme)
        .reduce((schemes, scheme) => schemes.concat(scheme), [])
        
      if (schemes.length) {
        type += ` <${schemes.join('|')}>`
      }
      return ` (${type.italic})`
    } else {
      return ` (${validator._type.italic})`
    }
  }

  function defaultValue () {
    if (validator._flags.hasOwnProperty('default')) {
      return `, default: ${String(validator._flags.default).gray}`
    } else {
      return ''
    }
  }

  function uriRules () {
    if (validator._type !== 'string') return false 
    return validator._tests.filter(({ name }) => name === 'uri')
  }
}

function descriptionLine (name, validator, value) {
  if (validator._description) {
    return `\n    ${validator._description}`
  }
}

function valueLine (name, validator, value) {
  if (differsFromDefault()) {
    const { value: actual, error } = validator.label(name).validate(value)
    if (error) {
      const invalidMessage = `invalid! ${error.message}`
      return `\n    overwritten: ${invalidMessage.red}`
    } else {
      return `\n    overwritten: ${value.bold.green}`
    }
  }

  function differsFromDefault () {
    const { value: actual, error } = validator.validate(value)
    const defaultValue = validator._flags.default
    return value !== undefined ? (actual !== defaultValue) : false
  }
}
