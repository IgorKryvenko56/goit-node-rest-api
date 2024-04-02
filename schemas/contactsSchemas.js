import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().allow('', null),
    email: Joi.string().email().allow('', null),
    phone: Joi.string().allow('', null)
});

export const updateContactSchema = Joi.object({
    name: Joi.string().allow('', null),
    email:Joi.string().email().allow('', null),
    phone: Joi.string().allow('', null)

});