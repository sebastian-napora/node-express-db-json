const express = require('express')
const { body, query, response } =
  require('express-joi-validation').createValidator({})

const { create, filtered, getAll } = require('../controllers/movies')
const {
  bodySchema,
  responseSchema,
  querySchema,
} = require('../validation/request')

/**
 * @module routes
 * @description This module return all available routes for the app.
 */
module.exports = () => {
  const router = express.Router()
  // all movies route
  router.get('/all-movies', response(responseSchema), getAll)
  // filtered movies route
  router.get('/filter-movies/:duration?/:genres?', query(querySchema), filtered)
  // crate new movie route
  router.post('/create-movie', body(bodySchema), create)

  return router
}
