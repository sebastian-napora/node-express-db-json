const Joi = require('@hapi/joi');
const { string, number } = Joi.types();

const Query = Joi.object().keys({
    genres: string.regex(/[^0-9-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/),
    duration: number
});

module.exports = Query;