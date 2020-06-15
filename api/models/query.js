const Joi = require('@hapi/joi');
const { string, number } = Joi.types();
const db = require('../../data/db.json');

const querySchema = Joi.object().keys({
    genres: string.regex(/[^0-9-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/).message(`You must send some of this genres: ${db.genres}`),
    duration: number
});

module.exports = querySchema;