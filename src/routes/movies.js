const { body, query, response } = require('express-joi-validation').createValidator({});

const { create, filtered, getAll } = require('../controllers/movies');
const { bodySchema, responseSchema, querySchema } = require('../validation/request');

module.exports = router => {
    router.get('/all-movies', response(responseSchema), getAll);

    router.get('/filter-movies/:duration?/:genres?', query(querySchema), filtered);

    router.post('/create-movie', body(bodySchema), create);

    return router
}
