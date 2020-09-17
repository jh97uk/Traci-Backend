const { valid } = require('@hapi/joi');

const Joi = require('@hapi/joi').extend(require('joi-phone-number'), require('@hapi/joi-date'));

const validate = {
    phoneNumber:Joi.object({
        number:Joi.string().phoneNumber({defaultCountry: 'GB', format: 'international'}),
        entryTimestamp:Joi.date(),
        departureTimestamp:Joi.date()
    }),

    Customer:Joi.object({
        phoneNumber:Joi.string().phoneNumber({defaultCountry: 'GB', format: 'international'}),
        entryTimestamp:Joi.date(),
        departureTimestamp:Joi.date()
    })
}

module.exports = validate;