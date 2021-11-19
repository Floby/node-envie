const Joi = attemptRequire()

if (!Joi) {
  throw Error('module `envie` could not load `joi`. Please make sure it is installed as a peer dependency')
}

module.exports = Joi

function attemptRequire () {
  try {
    return require('joi')
  } catch (e) {
    return null
  }
}
