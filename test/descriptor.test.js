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

  describe('when there is a default value', () => {
    const desc = Joi.number().default(8)
    describe('the first line', () => {
      it('contains the default value after the type', () => {
        return description(name, desc)
          .pipe(sink())
          .then(getLine(0))
          .then((line) => {
            expect(line).to.equal(`  ${name.bold.cyan} (${'number'.italic}), default: ${'8'.gray}`)
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

    describe('and .uri({scheme})', () => {
      context('when scheme is undefined', () => {
        const desc = Joi.string().uri()
        describe('the first line', () => {
          it('contains the name and type with colours', () => {
            return description(name, desc)
              .pipe(sink())
              .then(getLine(0))
              .then((line) => {
                expect(line).to.equal(`  ${name.bold.cyan} (${'uri'.italic})`)
              })
          })
        })
      })
      context('when there is one scheme', () => {
        const desc = Joi.string().uri({ scheme: 'http' })
        describe('the first line', () => {
          it('contains the name, type and declinations with colours', () => {
            return description(name, desc)
              .pipe(sink())
              .then(getLine(0))
              .then((line) => {
                expect(line).to.equal(`  ${name.bold.cyan} (${'uri <http>'.italic})`)
              })
          })
        })
      })
      context('when there are many schemes', () => {
        const desc = Joi.string().uri({ scheme: ['http', 'https'] }).uri({ scheme: 'ftp' })
        describe('the first line', () => {
          it('contains the name, type and declinations with colours', () => {
            return description(name, desc)
              .pipe(sink())
              .then(getLine(0))
              .then((line) => {
                expect(line).to.equal(`  ${name.bold.cyan} (${'uri <http|https|ftp>'.italic})`)
              })
          })
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
        const desc = Joi.string().default('World').description('something')
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
              expect(text.split('\n')).to.have.length(2)
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

    describe('invalid', () => {
      const desc = Joi.number()
      let value = 'hello'
      describe('the value line', () => {
        it('explains the validation error', () => {
          return description(name, desc, value)
            .pipe(sink())
            .then(getLine(1))
            .then((line) => {
              expect(line).to.equal(`    overwritten: ` + `invalid! "${name}" must be a number`.red)
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
