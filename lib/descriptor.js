require('colors')
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
  let annotation = ''
  if (validator._type !== 'any') {
    annotation = ` (${validator._type.italic})`
  }
  return `  ${name.bold.cyan}${annotation}`
}

function descriptionLine (name, validator, value) {
  if (validator._description) {
    return `\n    ${validator._description}`
  }
}

function valueLine (name, validator, value) {
  if (differsFromDefault()) {
    return `\n    overwritten: ${value.bold.green}`
  }

  function differsFromDefault () {
    const defaultValue = validator._flags.default
    return value !== undefined ? (value !== defaultValue) : false
  }
}
