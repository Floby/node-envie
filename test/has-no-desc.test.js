const Envie = require('../')
const { expect } = require('chai')

describe('new Envie({}, {})', () => {
  const envie = Envie({}, {
    values: { defined: 8 }
  })
  describe('.has(key)', () => {
    describe('when the key is not set up', () => {
      it('returns false', () => {
        expect(envie.has('not_defined')).to.equal(false)
      })
    })

    describe('when the key is set up', () => {
      it('returns true', () => {
        expect(envie.has('defined')).to.equal(true)
      })
    })
  })
})
