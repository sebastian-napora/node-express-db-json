const Joi = require('@hapi/joi')

const { array, string, number } = Joi.types()

const { movieSchema } = require('./movie')
const db = require('../../data/db.json')

/**
 * @module requestSchema
 * @description This module return querySchema, bodySchema and responseSchema.
 */
module.exports = {
  /**
   * @module querySchema
   * @description This properties returned a validation for query like generes or duration.
   */
  querySchema: Joi.object().keys({
    genres: string
      .regex(/[^0-9-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/)
      .message(`You must send some of this genres: ${db.genres}`),
    duration: number,
  }),
  /**
   * @module bodySchema
   * @description This properties returned a validation for body for POST method.
   */
  bodySchema: Joi.object().keys({
    id: number.required(),
    genres: array
      .required()
      .items(...db.genres)
      .min(1)
      .unique(),
    title: string.required().min(1).max(255),
    year: number.required(),
    runtime: number.required(),
    director: string.required().min(1).max(255),
    actors: string.allow(''),
    plot: string.allow(''),
    posterUrl: string.allow(''),
  }),
  /**
   * @module responseSchema
   * @description This properties returned a validation for GET method which should returned the data with all needed properties.
   */
  responseSchema: Joi.object().keys({
    message: string,
    count: number,
    data: array.items(movieSchema),
  }),
}
