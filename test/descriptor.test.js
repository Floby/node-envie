require('colors')
const { expect } = require('chai')
const Joi = require('joi')
const Descriptor = require('../lib/descriptor')

describe('Descriptor.description(name, validator, value)', () => {
  const description = Descriptor.description
  const name = 'MY_KEY'

  it('returns a string', () => {
    const actual = description(name, Joi.any())
    expect(actual).to.be.a('string')
  })

  describe('when the validator is .any()', () => {
    const desc = Joi.any()
    describe('the first line', () => {
      it('contains the name with colours', () => {
        const lines = split(description(name, desc))
        expect(lines[0]).to.equal(`  ${name.bold.cyan}`)
      })
    })
    describe('with a description', () => {
      const text = 'My human readable description'
      const desc = Joi.any().description(text)
      describe('the first line', () => {
        it('contains the name with colours', () => {
          const lines = split(description(name, desc))
          expect(lines[0]).to.equal(`  ${name.bold.cyan}`)
        })
      })

      describe('the second line', () => {
        it('contains the human readable description', () => {
          const lines = split(description(name, desc))
          expect(lines[1]).to.equal(`    ${text}`)
        })
      })

      describe('and an example', () => {
        const example = 'Some text'
        const desc = Joi.any().description(text).example(example)
        describe('the third line', () => {
          it('contains the example', () => {
            const expected = `(e.g. ${example})`.gray
            const lines = split(description(name, desc))
            expect(lines[2]).to.equal(`    ${expected}`)
          })
        })
      })
    })
  })

  describe('when there is a default value', () => {
    const desc = Joi.number().default(8)
    describe('the first line', () => {
      it('contains the default value after the type', () => {
        const lines = split(description(name, desc))
        expect(lines[0]).to.equal(`  ${name.bold.cyan} (${'number'.italic}), default: ${'8'.gray}`)
      })
    })
  })

  describe('when the validator is .string()', () => {
    const desc = Joi.string()
    describe('the first line', () => {
      it('contains the name and type with colours', () => {
        const lines = split(description(name, desc))
        expect(lines[0]).to.equal(`  ${name.bold.cyan} (${'string'.italic})`)
      })
    })

    describe('and .uri({scheme})', () => {
      context('when scheme is undefined', () => {
        const desc = Joi.string().uri()
        describe('the first line', () => {
          it('contains the name and type with colours', () => {
            const lines = split(description(name, desc))
            expect(lines[0]).to.equal(`  ${name.bold.cyan} (${'uri'.italic})`)
          })
        })
      })
      context('when there is one scheme', () => {
        const desc = Joi.string().uri({ scheme: 'http' })
        describe('the first line', () => {
          it('contains the name, type and declinations with colours', () => {
            const lines = split(description(name, desc))
            expect(lines[0]).to.equal(`  ${name.bold.cyan} (${'uri <http>'.italic})`)
          })
        })
      })
      context('when there are many schemes', () => {
        const desc = Joi.string().uri({ scheme: ['http', 'https', 'ftp'] })
        describe('the first line', () => {
          it('contains the name, type and declinations with colours', () => {
            const lines = split(description(name, desc))
            expect(lines[0]).to.equal(`  ${name.bold.cyan} (${'uri <http|https|ftp>'.italic})`)
          })
        })
      })
    })
  })

  describe('when there is a value setup', () => {
    const desc = Joi.string().default('World')
    describe('different from the default', () => {
      const value = 'Hello'
      describe('and no description', () => {
        describe('the second line', () => {
          it('contains the overloaded value', () => {
            const lines = split(description(name, desc, value))
            expect(lines[1]).to.equal(`    overwritten: ${value.bold.green}`)
          })
        })
      })
      describe('and a description', () => {
        const desc = Joi.string().default('World').description('something')
        describe('the third line', () => {
          it('contains the overloaded value', () => {
            const lines = split(description(name, desc, value))
            expect(lines[2]).to.equal(`    overwritten: ${value.bold.green}`)
          })
        })
      })
    })

    describe('equal to the default', () => {
      const value = 'World'
      describe('the description', () => {
        it('does not mention it', () => {
          const lines = split(description(name, desc, value))
          expect(lines).to.have.length(2)
        })
      })
    })

    describe('to undefined', () => {
      let value
      describe('the description', () => {
        it('does not mention it', () => {
          const lines = split(description(name, desc, value))
          expect(lines).not.to.contain(value)
        })
      })
    })

    describe('invalid', () => {
      const desc = Joi.number()
      let value = 'hello'
      describe('the value line', () => {
        it('explains the validation error', () => {
          const lines = split(description(name, desc, value))
          expect(lines[1]).to.equal(`    overwritten: ` + `invalid! "${name}" must be a number`.red)
        })
      })
    })
  })
})

function split (text) {
  return text.split(/\n/)
}
