const { Envie, Joi } = require('./')

const envie = new Envie({
  MY_STRING: Joi
    .string()
    .description('String that I expect'),
  MY_NUMBER: Joi
    .number()
    .default(0)
    .description('number between 0 and 999'),
  MY_URL: Joi
    .string()
    .uri({ scheme: 'postgres' })
    .description('Connection string to my postgresql database')
})


envie.displayHelp()
