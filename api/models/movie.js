const Joi = require('@hapi/joi');

const Movie = Joi.object().keys({
    id: Joi.number().required(),
    genres: Joi.array().required(),
    title: Joi.string().required(),
    year: Joi.number().required(),
    runtime: Joi.number().required(),
    director: Joi.string().required(),
    actors: Joi.string(),
    plot: Joi.string(),
    posterUrl: Joi.string(),
});

module.exports = Movie;
