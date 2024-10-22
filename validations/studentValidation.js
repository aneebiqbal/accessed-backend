const Joi = require('joi');

const studentRegistrationSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    number: Joi.string().pattern(/^(?:\+92|92|0)?3[0-9]{2}[0-9]{7}$/).required(), // Pakistani mobile number format
    password: Joi.string().min(8).required(),
    test_id: Joi.number().integer().required()
});

module.exports = { studentRegistrationSchema };
