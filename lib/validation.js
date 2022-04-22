const Joi = require("joi");

exports.mainCategorySchema = Joi.object({
    name: Joi.string().max(20).required(),
});

exports.subCategorySchema = Joi.object({
    name: Joi.string().max(20).required(),
    parentId: Joi.number().required(),
});

exports.productSchema = Joi.object({
    name: Joi.string().max(100).required(),
    categoryId: Joi.number().required(),
    address: Joi.string().max(100).required(),
    price: Joi.number().required(),
    detail: Joi.string().max(1000).required(),
    negotiation: Joi.string().required(),
    currency: Joi.string().required(),
    type: Joi.string().required(),
    condition: Joi.string().required(),
});
