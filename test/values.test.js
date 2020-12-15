const Joi = require('joi')
const Envie = require('../')
const { expect } = require('chai')

describe('new Envie({descriptions...}, {...values})', () => {
  describe('.values()', () => {
    describe('with valid data', () => {
      it('returns values', () => {
        const description = {
          with_default: Joi.string().default('hello world'),
          to_cast: Joi.number(),
          defined: Joi.number()
        }
        const envie = Envie(description, {
          to_cast: '8',
          defined: 8
        })
        expect(envie.values()).to.deep.equal({
          with_default: 'hello world',
          to_cast: 8,
          defined: 8
        })
      })
    })

    describe('with invalid data', () => {
      it('throws error', () => {
        const description = {
          not_defined: Joi.string().required(),
          invalid: Joi.number()
        }
        const envie = Envie(description, {
          invalid: 'hello'
        })

        let err
        try {
          envie.values()
        } catch (_err) {
          err = _err
        }
        expect(err).to.be.instanceOf(Error)

        expect(err.details).to.have.length(2)

        expect(err.details[0].message).to.contain('"not_defined" is required')
        expect(err.details[1].message).to.contain('"invalid" must be a number')
      })
    })
  })
})
