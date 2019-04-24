const Joi = attemptRequire('@hapi/joi') || attemptRequire('joi')

if (!Joi) {
  throw Error('module `envie` could not load `joi`. Please make sure it is installed as a peer dependency')
}

module.exports = Joi

function attemptRequire (name) {
  try {
    return require('joi')
  } catch (e) {
    return null
  }
}
