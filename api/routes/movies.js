const validator = require('express-joi-validation').createValidator({});

const movieController = require('../controllers/movies');
const { bodySchema, responseSchema, querySchema } = require('../models/request');

module.exports = router => {
    router.get('/all-movies', validator.response(responseSchema, { statusCode: 500 }), movieController.getAll);

    router.get('/filter-movies/:duration?/:genres?', validator.query(querySchema, { statusCode: 400 }), movieController.filterMovies)

    router.post('/', validator.body(bodySchema, { statusCode: 500 }), movieController.createMovie)

    return router
}
