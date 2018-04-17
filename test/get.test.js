const Joi = require('joi')
const Envie = require('../')
const { expect } = require('chai')

describe('new Envie({descriptions...}, {...values})', () => {
  const description = {
    with_default: Joi.string().default('hello world'),
    not_defined: Joi.number(),
    to_cast: Joi.number(),
    defined: Joi.number(),
    invalid: Joi.number()
  }
  const envie = Envie(description, {
    to_cast: '8',
    defined: 8,
    invalid: 'hello'
  })
  describe('.get(key)', () => {
    describe('when the value is not set up', () => {
      it('returns undefined', () => {
        expect(envie.get('not_defined')).to.equal(undefined)
      })

      describe('but there is a default value', () => {
        it('returns the default value', () => {
          expect(envie.get('with_default')).to.equal('hello world')
        })

        describe('but noDefaults option is true', () => {
          const envie = Envie(description, {}, { noDefaults: true })
          it('returns undefined', () => {
            expect(envie.get('with_default')).to.equal(undefined)
          })
        })
      })
    })

    describe('when the value is valid', () => {
      it('returns the value', () => {
        expect(envie.get('defined')).to.equal(8)
      })

      describe('but not the correct type', () => {
        it('returns the re-cast value', () => {
          expect(envie.get('to_cast')).to.equal(8)
        })
      })
    })

    describe('when the value is invalid', () => {
      it('throws', () => {
        expect(() => envie.get('invalid')).to.throw(/invalid is not valid/i)
      })
    })
  })
})
