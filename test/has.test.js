const Joi = require('joi')
const Envie = require('../')
const { expect } = require('chai')

describe('new Envie({descriptions...})', () => {
  const description = {
    not_defined: Joi.number(),
    defined: Joi.number(),
    invalid: Joi.number()
  }
  const envie = Envie(description, {
    defined: 8,
    invalid: 'hello'
  })
  describe('.has(key)', () => {
    describe('when the value is not set up', () => {
      it('returns false', () => {
        expect(envie.has('not_defined')).to.equal(false)
      })
    })

    describe('when the value is valid', () => {
      it('returns true', () => {
        expect(envie.has('defined')).to.equal(true)
      })
    })

    describe('when the value is invalid', () => {
      it('returns false', () => {
        expect(envie.has('invalid')).to.equal(false)
      })
    })
  })
})
