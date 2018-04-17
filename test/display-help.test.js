const sinon = require('sinon')
const sink = require('stream-sink')
const Joi = require('joi')
const Envie = require('../')
const { expect } = require('chai')
require('chai').use(require('sinon-chai'))

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
    const helpString = 'Hello World!'
    let helpStringStub
    beforeEach(() => {
      helpStringStub = sinon.stub(envie, 'helpString')
    })
    afterEach(() => helpStringStub.restore())

    beforeEach(() => {
      helpStringStub.returns(helpString)
    })

    it('calls self.helpString() and writes the result to the target', () => {
      return envie.displayHelp(sink()).then((written) => {
        expect(written).to.equal(helpString)
        expect(helpStringStub).to.have.been.calledOnce()
      })
    })

    describe('when there is no specified target', () => {
      it('uses process.stderr as default', () => {
        // Given
        const testSink = sink()
        const onPipe = sinon.spy((source) => {
          source.unpipe(process.stderr)
          source.pipe(testSink)
        })
        process.stderr.once('pipe', onPipe)

        // When
        const target = envie.displayHelp()

        // Then
        expect(target).to.equal(process.stderr)
        return testSink.then((actual) => {
          expect(actual).to.equal(helpString)
          expect(onPipe).to.have.been.calledOnce()
        })
      })
    })
  })
})
