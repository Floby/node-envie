const Envie = require('../')
const { expect } = require('chai')

describe('new Envie({}, {})', () => {
  const envie = Envie({}, {
    defined: 8
  })
  describe('.validate()', () => {
    it('returns true', () => {
      expect(envie.validate()).to.equal(true)
    })
  })
})

