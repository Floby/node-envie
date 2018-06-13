const Envie = require('../')
const { expect } = require('chai')

describe('new Envie({}, {})', () => {
  const envie = Envie({}, {
    values: { defined: 8 }
  })
  describe('.get(key)', () => {
    describe('when the key is not set up', () => {
      it('returns undefined', () => {
        expect(envie.get('not_defined')).to.equal(undefined)
      })
    })

    describe('when the key is set up', () => {
      it('returns the raw value', () => {
        expect(envie.get('defined')).to.equal(8)
      })
    })
  })
})
