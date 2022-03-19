const Joi = require('@hapi/joi')

const { array, string, number } = Joi.types()

const movieSchema = Joi.object().keys({
  id: number.required(),
  genres: array.required(),
  title: string.required().min(1).max(255),
  year: number.required(),
  runtime: number.required(),
  director: string.required().min(1).max(255),
  actors: string.allow(''),
  plot: string.allow(''),
  posterUrl: string.allow(''),
})

/**
 * @module movieSchema
 * @description This module return schema for movie.
 */
module.exports = {
  movieSchema,
}
