const validator = require('express-joi-validation').createValidator({});

const movieController = require('../controllers/movies');
const requestSchema = require('../models/request');

module.exports = router => {
    router.get('/all-movies', validator.response(requestSchema.responseSchema, { statusCode: 500 }), movieController.getAll);

    router.get('/filter-movies/:duration?/:genres?', validator.query(requestSchema.querySchema, { statusCode: 400 }), movieController.filtered);

    router.post('/create-movie', validator.body(requestSchema.bodySchema, { statusCode: 500 }), movieController.create);

    return router
}
