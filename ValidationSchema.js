const { valid } = require('@hapi/joi');

const Joi = require('@hapi/joi').extend(require('joi-phone-number'), require('@hapi/joi-date'));

const validate = {
    phoneNumber:Joi.object({
        number:Joi.string().phoneNumber({defaultCountry: 'GB', format: 'international'}),
        entryTimestamp:Joi.date(),
        departureTimestamp:Joi.date()
    }),

    Customer:Joi.object({
        id:Joi.number(),
        phoneNumber:Joi.string().phoneNumber({defaultCountry: 'GB', format: 'international'}),
        entryTimestamp:Joi.date(),
        departureTimestamp:Joi.date()
    }),
    
    CustomerSearch: Joi.object({
        id:Joi.number(),
        number:Joi.string().phoneNumber({defaultCountry: 'GB', format: 'international'}),
        startDate:Joi.date(),
        endDate:Joi.date(),
        offset:Joi.number()
    }),

    Establishment: Joi.object({
        establishmentName: Joi.string().min(2).max(100).label("Name"),
        establishmentMessage: Joi.string().min(2).max(350).label("Message"),
    })
}

module.exports = validate;