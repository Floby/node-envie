require('colors')

exports.description = function (name, validator, value) {
  return [nameAndTypeLine, descriptionLine, valueLine].map((lineFunction) => {
    const line = lineFunction(name, validator, value)
    return line || ''
  }).join('') + '\n'
}

function nameAndTypeLine (name, validator, value) {
  const desc = validator.describe()
  return `  ${name.bold.cyan}${annotation()}${defaultValue()}`

  function annotation () {
    if (desc.type === 'any') {
      return ''
    } else if (uriRules().length) {
      let type = 'uri'
      const schemes = uriRules()
        .filter((rule) => rule.args && rule.args.options && rule.args.options.scheme)
        .map((rule) => rule.args.options.scheme)
        .reduce((schemes, scheme) => schemes.concat(scheme), [])
      if (schemes.length) {
        type += ` <${schemes.join('|')}>`
      }
      return ` (${type.italic})`
    } else {
      return ` (${desc.type.italic})`
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
    if (desc.type !== 'string') return false
    if (!desc.rules) return false
    return desc.rules.filter(({ name }) => name === 'uri')
  }
}

function descriptionLine (name, validator, value) {
  const desc = validator.describe()
  if (desc.flags && desc.flags.description) {
    return `\n    ${desc.flags.description}`
  }
}

function valueLine (name, validator, value) {
  if (differsFromDefault()) {
    const { error } = validator.label(name).validate(value)
    if (error) {
      const invalidMessage = `invalid! ${error.message}`
      return `\n    overwritten: ${invalidMessage.red}`
    } else {
      return `\n    overwritten: ${value.bold.green}`
    }
  }

  function differsFromDefault () {
    const { value: actual } = validator.validate(value)
    const defaultValue = validator._flags.default
    return value !== undefined ? (actual !== defaultValue) : false
  }
}
