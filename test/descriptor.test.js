const colors = require('colors')
const { expect } = require('chai')
const Joi = require('joi')
const sink = require('stream-sink')
const Descriptor = require('../lib/descriptor')

describe('Descriptor.description(name, validator, value)', () => {
  const description = Descriptor.description
  const name = 'MY_KEY'

  it('returns a readable stream', () => {
    return description(name, Joi.any()).pipe(sink()).then((desc) => {
      expect(desc).to.be.a('string')
    })
  })

  describe('when the validator is .any()', () => {
    const desc = Joi.any()
    describe('the first line', () => {
      it('contains the name with colours', () => {
        return description(name, desc)
          .pipe(sink())
          .then(getLine(0))
          .then((line) => {
            expect(line).to.equal(`  ${name.bold.cyan}`)
          })
      })
    })
    describe('with a description', () => {
      const text = 'My human readable description'
      const desc = Joi.any().description(text)
      describe('the first line', () => {
        it('contains the name with colours', () => {
          return description(name, desc)
            .pipe(sink())
            .then(getLine(0))
            .then((line) => {
              expect(line).to.equal(`  ${name.bold.cyan}`)
            })
        })
      })

      describe('the second line', () => {
        it('contains the human readable description', () => {
          return description(name, desc)
            .pipe(sink())
            .then(getLine(1))
            .then((line) => {
              expect(line).to.equal(`    ${text}`)
            })
        })
      })
    })
  })
})

function getLine (index) {
  return function (text) {
    return String(text.split('\n')[index])
  }
}
