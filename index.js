module.exports = Envie

function Envie (description, values) {
  if (!(this instanceof Envie)) return new Envie(description, values)

  this.get = function (key) {
    return values[key]
  }
}
