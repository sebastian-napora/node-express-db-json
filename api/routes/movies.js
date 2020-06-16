const validator = require('express-joi-validation').createValidator({});

const { create, filtered, getAll } = require('../controllers/movies');
const { bodySchema, responseSchema, querySchema } = require('../models/request');

module.exports = router => {
    router.get('/all-movies', validator.response(responseSchema, { statusCode: 500 }), getAll);

    router.get('/filter-movies/:duration?/:genres?', validator.query(querySchema, { statusCode: 400 }), filtered);

    router.post('/create-movie', validator.body(bodySchema, { statusCode: 500 }), create);

    return router
}
