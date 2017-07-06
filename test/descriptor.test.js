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

  describe('when the validator is .string()', () => {
    const desc = Joi.string()
    describe('the first line', () => {
      it('contains the name and type with colours', () => {
        return description(name, desc)
          .pipe(sink())
          .then(getLine(0))
          .then((line) => {
            expect(line).to.equal(`  ${name.bold.cyan} (${'string'.italic})`)
          })
      })
    })
  })

  describe('when there is a value setup', () => {
    const desc = Joi.string().default('World')
    describe('different from the default', () => {
      const value = "Hello"
      describe('and no description', () => {
        describe('the second line', () => {
          it('contains the overloaded value', () => {
            return description(name, desc, value)
              .pipe(sink())
              .then(getLine(1))
              .then((line) => {
                expect(line).to.equal(`    overwritten: ${value.bold.green}`)
              })
          })
        })
      })
      describe('and a description', () => {
        const desc = Joi.string().description('something')
        describe('the third line', () => {
          it('contains the overloaded value', () => {
            return description(name, desc, value)
              .pipe(sink())
              .then(getLine(2))
              .then((line) => {
                expect(line).to.equal(`    overwritten: ${value.bold.green}`)
              })
          })
        })
      })
    })

    describe('equal to the default', () => {
      const value = "World"
      describe('the description', () => {
        it('does not mention it', () => {
          return description(name, desc, value)
            .pipe(sink())
            .then((text) => {
              expect(text).not.to.contain(value)
            })
        })
      })
    })

    describe('to undefined', () => {
      let value
      describe('the description', () => {
        it('does not mention it', () => {
          return description(name, desc, value)
            .pipe(sink())
            .then((text) => {
              expect(text).not.to.contain(value)
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
