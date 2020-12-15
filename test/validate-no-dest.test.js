const Joi = require('joi')
const Envie = require('../')
const { expect } = require('chai')

describe('new Envie({}, {})', () => {
  const envie = Envie({}, {
    defined: 8
  })
  describe('.validate()', () => {
    it('does not throw', () => {
      expect(() => envie.validate()).not.to.throw()
    })
  })
})

describe('new Envie(schema, values)', () => {
  const envie = Envie({
    key: Joi.number()
  }, {
    key: 8
  })
  describe('.validate()', () => {
    context('with valid data', () => {
      it('does not throw', () => {
        expect(() => envie.validate()).not.to.throw()
      })
    })
    context('with valid data', () => {
      const envie = Envie({
        key: Joi.number()
      }, {
        key: 'hello'
      })
      it('throws', () => {
        expect(() => envie.validate()).to.throw()
      })
    })
  })
})
