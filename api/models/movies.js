const Joi = require('@hapi/joi');
// const JoiModel = require('joi-model');

const Product = Joi.object().keys({
    id: Joi.number().required(),
    name: Joi.string().required(),
    price: Joi.number().required()
});

module.exports = Product;
// module.exports = JoiModel(Product);
