const Joi = require('joi');

const registrationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    userName: Joi.string().optional()
})

module.exports = {registrationSchema};