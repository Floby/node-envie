require('colors')
const stream = require('stream')

exports.description = function (name, validator, value) {
  const descriptionStream = new stream.PassThrough()
  descriptionStream.write(`  ${name.bold.cyan}`)
  if (validator._description) {
    descriptionStream.write(`\n    ${validator._description}`)
  }
  descriptionStream.end('\n')
  return descriptionStream
}
