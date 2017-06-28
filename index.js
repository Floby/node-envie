module.exports = Envie

function Envie (description, values) {
  if (!(this instanceof Envie)) return new Envie(description, values)

  this.get = function (key) {
    return values[key]
  }

  this.has = function (key) {
    return values.hasOwnProperty(key)
  }

  this.validate = () => true
}
