const Joi = require('@hapi/joi');
const { array, string, number } = Joi.types();

const { movieSchema } = require('./movie');
const db = require('../../data/db.json');

module.exports = {
    querySchema: Joi.object().keys({
        genres: string.regex(/[^0-9-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/).message(`You must send some of this genres: ${db.genres}`),
        duration: number
    }),
    bodySchema: Joi.object().keys({
        id: number.required(),
        genres: array.required(),
        title: string.required().min(1).max(255),
        year: number.required(),
        runtime: number.required(),
        director: string.required().min(1).max(255),
        actors: string.allow(""),
        plot: string.allow(""),
        posterUrl: string.allow(""),
    }),
    responseSchema: Joi.object().keys({
        message: string,
        count: number,
        data: array.items(movieSchema)
    })
};
