const Envie = require('../')
const Joi = require('joi')
const { expect } = require('chai')

describe('Envie', () => {
  it('is a function', () => {
    expect(Envie).to.be.a('function')
  })
  describe('.Envie', () => {
    it('is the same function', () => {
      expect(Envie.Envie).to.be.a('function').and.equal(Envie)
    })
  })

  describe('.Joi', () => {
    it('is the bundled Joi module', () => {
      expect(Envie.Joi).to.equal(Joi)
    })
  })
})
