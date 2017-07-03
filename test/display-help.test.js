const sinon = require('sinon')
const sink = require('stream-sink')
const stream = require('stream')
const Joi = require('joi')
const Envie = require('../')
const Descriptor = require('../lib/descriptor')
const { expect } = require('chai')

describe('new Envie({descriptions...})', () => {
  const description = {
    with_default: Joi.string().default('hello world'),
    not_defined: Joi.number(),
    to_cast: Joi.number(),
    defined: Joi.number(),
    invalid: Joi.number()
  }
  const values = {
    to_cast: '8',
    defined: 8,
    invalid: 'hello'
  }
  const envie = Envie(description, values)

  describe('.displayHelp(writable)', () => {
    let descriptorMock
    beforeEach(() => {
      descriptorMock = sinon.mock(Descriptor)
    })
    afterEach(() => descriptorMock.restore())

    it('calls Descriptor.description() for each entry', () => {
      Object.keys(description).forEach((key) => {
        descriptorMock
          .expects('description')
          .withArgs(key, description[key], values[key])
          .callsFake(say('hey'))
      })
      return envie.displayHelp(sink()).then(() => {
        descriptorMock.verify()
      })
    })

    it('concatenates the result of each description in the writable stream', () => {
      Object.keys(description).forEach((key) => {
        descriptorMock
          .expects('description')
          .withArgs(key)
          .callsFake(say(`${key}\n`))
      })
      return envie.displayHelp(sink()).then((actual) => {
        expect(actual).to.equal(
`with_default

not_defined

to_cast

defined

invalid
`
        )
      })
    })
  })
})


function say (content) {
  return function () {
    const result = stream.PassThrough()
    result.end(content)
    return result
  }
}
