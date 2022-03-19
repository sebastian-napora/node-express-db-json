const { responseObject } = require('../helpers/helper')

/**
 * @function randomMovies
 * @description This function return randomly movie.
 */
const randomMovies = (database) => [
  database[Math.floor(Math.random() * database.length)],
]

/**
 * @function filteredMoviesDependOnData
 * @description This function filtered list of movies by generes.
 */
const filteredMoviesDependOnData = (data, selectedGenres) =>
  data.filter(({ genres }) =>
    genres.some((genre) => selectedGenres.includes(genre))
  )

/**
 * @function sortedArrayByMatchesGenres
 * @description This function sorted movies by generes.
 */
const sortedArrayByMatchesGenres = (array) =>
  array.sort((a, b) => b.matchedGenres - a.matchedGenres)

/**
 * @function countedMatchingGenres
 * @description This function takes data from db.json file and read. Parameters: path, coding type.
 */
const countedMatchingGenres = (selectedGenres, { genres }) =>
  genres
    .map((genre) => selectedGenres.includes(genre))
    .filter((isTrue) => isTrue === true).length

/**
 * @function convertedArray
 * @description This function mapped the data by generes.
 */
const convertedArray = (array, selectedGenres) =>
  sortedArrayByMatchesGenres(
    array.map((movie) => ({
      ...movie,
      genres: movie.genres,
      matchedGenres: countedMatchingGenres(selectedGenres, movie),
    }))
  )

/**
 * @function filterMovie
 * @description This function return a proper list of movies. Take a param from URL and need a list of movies.
 */
module.exports = function filterMovie(params, movies) {
  const { duration, genresByQuery } = params
  const durationBetween = [+duration - 10, +duration, +duration + 10]
  const filteredMoviesByDuration = movies.movies.filter(({ runtime }) =>
    durationBetween.includes(+runtime)
  )

  if (genresByQuery || duration) {
    if (genresByQuery) {
      const selectedGenres = genresByQuery.split(',')
      let filteredMovies

      // if duration paramter exist then filter database by duration
      if (duration) {
        filteredMovies = filteredMoviesDependOnData(
          filteredMoviesByDuration,
          selectedGenres
        )
      } else {
        filteredMovies = filteredMoviesDependOnData(
          movies.movies,
          selectedGenres
        )
      }

      const moviesByDurationAndCategories = responseObject(
        'MOVIES BY DURATION AND CATEGORIES',
        convertedArray(filteredMovies, selectedGenres).length,
        convertedArray(filteredMovies, selectedGenres)
      )

      return moviesByDurationAndCategories
    }

    const returnRandomMovieByDuration = responseObject(
      'GET RANDOM MOVIES BY DURATION',
      1,
      randomMovies(filteredMoviesByDuration)
    )

    return returnRandomMovieByDuration
  }
  const getRandomMovies = responseObject(
    'GET RANDOM MOVIES',
    1,
    randomMovies(movies.movies)
  )

  return getRandomMovies
}
