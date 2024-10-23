const Joi = require('joi');

const studentRegistrationSchema = Joi.object({
    first_name: Joi.string().min(3).required().messages({
        'string.base': 'First name must be a text string.',
        'string.empty': 'First name is required.',
        'string.min': 'First name must be at least 3 characters long.',
        'any.required': 'First name is required.'
    }),
    last_name: Joi.string().min(3).required().messages({
        'string.base': 'Last name must be a text string.',
        'string.empty': 'Last name is required.',
        'string.min': 'Last name must be at least 3 characters long.',
        'any.required': 'Last name is required.'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email address.',
        'any.required': 'Email is required.'
    }),
    number: Joi.string().pattern(/^(?:\+92|92|0)?3[0-9]{2}[0-9]{7}$/).required().messages({   // Pakistani mobile number format
        'string.pattern.base': 'Please enter a valid Pakistani mobile number.',
        'any.required': 'Mobile number is required.'
    }),
    password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/)  // At least 1 uppercase, 1 number, 1 special character
    .required().messages({
        'string.min': 'Password must be at least 6 characters long with at least one uppercase letter, one number, and one special character.',
        'string.pattern.base': 'Password must include at least one uppercase letter, one number, and one special character.',
        'any.required': 'Password is required.'
    }),

    test_id: Joi.number().integer().required().messages({
        'any.required': 'University/Test is required.'
        })
});

const firstNameSchema = Joi.object({
    first_name: Joi.string().min(3).required().messages({
        'string.base': 'First name must be a text string.',
        'string.empty': 'First name is required.',
        'string.min': 'First name must be at least 3 characters long.',
        'any.required': 'First name is required.'
    }),
});

const lastNameSchema = Joi.object({
    last_name: Joi.string().min(3).required().messages({
        'string.base': 'Last name must be a text string.',
        'string.empty': 'Last name is required.',
        'string.min': 'Last name must be at least 3 characters long.',
        'any.required': 'Last name is required.'
    }),
});


const numberSchema = Joi.object({
    number: Joi.string().pattern(/^(?:\+92|92|0)?3[0-9]{2}[0-9]{7}$/).required().messages({   // Pakistani mobile number format
        'string.pattern.base': 'Please enter a valid Pakistani mobile number.',
        'any.required': 'Mobile number is required.'
    }),
});

const passwordSchema = Joi.object({
    password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/)  // At least 1 uppercase, 1 number, 1 special character
    .required().messages({
        'string.min': 'Password must be at least 6 characters long with at least one uppercase letter, one number, and one special character.',
        'string.pattern.base': 'Password must include at least one uppercase letter, one number, and one special character.',
        'any.required': 'Password is required.'
    }),
});


module.exports = { firstNameSchema, lastNameSchema, numberSchema, passwordSchema, studentRegistrationSchema };
