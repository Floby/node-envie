const Envie = require('../')
const { expect } = require('chai')

describe('new Envie(desc, values)', () => {
  const envie = Envie({
    described_as_number: 8,
    set_as_not_number: 8,
    described_as_bool: false,
    set_as_not_boolean: false,
    described_as_short_string: 'my_symbol',
    set_as_not_short_string: 'my_symbol',
    described_as_long_string: 'my symbol',
    set_as_long_string: 'my symbol',
  }, {
    set_as_not_number: 'hello',
    set_as_not_boolean: 'hello',
    set_as_not_short_string: 8,
    set_as_not_long_string: 42,
  })
  describe('.get(key)', () => {
    context('when the desc is only a number', () => {
      it('it returns it as the default value', () => {
        expect(envie.get('described_as_number')).to.equal(8)
      })
      it('fails to get a non number value', () => {
        expect((() => envie.get('set_as_not_number'))).to.throw(/not valid/i)
      })
    })
    context('when the desc is only a boolean', () => {
      it('it returns it as the default value', () => {
        expect(envie.get('described_as_bool')).to.equal(false)
      })
      it('fails to get a non boolean value', () => {
        expect((() => envie.get('set_as_not_boolean'))).to.throw(/not valid/i)
      })
    })
    context('when the desc is only a string without spaces', () => {
      it('it returns it as the default value', () => {
        expect(envie.get('described_as_short_string')).to.equal('my_symbol')
      })
      it('fails to get a non short string value', () => {
        expect((() => envie.get('set_as_not_short_string'))).to.throw(/not valid/i)
      })
    })
    context('when the desc is only a string with spaces', () => {
      it('it returns undefined as the default value', () => {
        expect(envie.get('described_as_long_string')).to.equal(undefined)
      })
      it('can get a value of any type', () => {
        expect(envie.get('set_as_not_long_string')).to.equal(42)
      })
    })
  })
})
