const Movies = require('../models/movies')
const filterMovie = require('./utils')
const { modifiedJsonData } = require('../models/utils')
const { responseObject } = require('../helpers/helper')
const { DB_PATH } = require('../constants')

module.exports = {
  getAll: async (req, res) => {
    try {
      const resolvedPromise = await new Movies().getAll()
      const result = modifiedJsonData(resolvedPromise, 'Parse')

      // return all movies
      res
        .status(200)
        .json(
          responseObject('GET ALL MOVIES', result.movies.length, result.movies)
        )
    } catch (err) {
      res.status(400).send('Something went wrong')
    }
  },
  filtered: async (req, res, next) => {
    try {
      const genresByQuery = req.query.genres
      const { duration } = req.query

      const resolvedPromise = await new Movies().getAll()
      const result = modifiedJsonData(resolvedPromise, 'Parse')

      const resultFilteredMovies = filterMovie(
        { genresByQuery, duration },
        result
      )

      // return filtered list of movies
      res.status(200).json(resultFilteredMovies)
    } catch (err) {
      next(new Error(err))
    }
  },
  create: async (req, res, next) => {
    try {
      const {
        id,
        genres,
        title,
        year,
        runtime,
        director,
        actors,
        plot,
        posterUrl,
      } = req.body

      const data = {
        id,
        genres,
        title,
        year,
        runtime,
        director,
        actors,
        plot,
        posterUrl,
      }

      // create new movie
      await new Movies().create(data, DB_PATH)

      // return new list of movies
      res
        .status(201)
        .json(responseObject('Movies created successfully', 1, data))
    } catch (err) {
      next(new Error(err))
    }
  },
}
