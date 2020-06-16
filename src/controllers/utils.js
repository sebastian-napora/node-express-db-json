const { responseObject } = require('../helpers/helper');

const randomMovies = database => [database[Math.floor(Math.random() * database.length)]];

const filtredMoviesDependOnData = (data, selectedGenres) => {
    return data.filter(({ genres }) => genres.some(genre => selectedGenres.includes(genre)))
};

const convertedArray = (array, selectedGenres) => sortedArrayByMatchesGenres(array.map(movie => ({
        ...movie,
        genres: movie.genres,
        matchedGenres: countedMatchingGenres(selectedGenres, movie)
    })
));

const sortedArrayByMatchesGenres = array => array.sort((a, b) => b.matchedGenres - a.matchedGenres);

const countedMatchingGenres = (selectedGenres, { genres }) => {
    return genres
        .map(genre => selectedGenres.includes(genre))
        .filter(isTrue => isTrue === true).length
};

module.exports = function filterMovie(params, movies) {
    const { duration, genresByQuery } = params;
    const durationBetween = [+duration - 10, +duration, +duration + 10];
    const filteredMoviesByDuration = movies.movies.filter(({ runtime }) => durationBetween.includes(+runtime));

    if (genresByQuery || duration) {
        if(genresByQuery) {
            const selectedGenres = genresByQuery.split(',');
            let filteredMovies;

            duration
                ? filteredMovies = filtredMoviesDependOnData(filteredMoviesByDuration, selectedGenres)
                : filteredMovies = filtredMoviesDependOnData(movies.movies, selectedGenres);

            return responseObject(
                'MOVIES BY DURATION AND CATEGORIES',
                convertedArray(filteredMovies, selectedGenres).length,
                convertedArray(filteredMovies, selectedGenres)
            );
        } else {
            return responseObject('GET RANDOM MOVIES BY DURATION',  1, randomMovies(filteredMoviesByDuration));
        }

    } else {
       return responseObject('GET RANDOM MOVIES', 1, randomMovies(movies.movies));
    }
}
