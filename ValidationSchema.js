const { valid } = require('@hapi/joi');

const Joi = require('@hapi/joi').extend(require('joi-phone-number'));

const validate = {
    phoneNumber:Joi.object({
        number:Joi.string().phoneNumber({defaultCountry: 'GB', format: 'international'})
    })
}

module.exports = validate;