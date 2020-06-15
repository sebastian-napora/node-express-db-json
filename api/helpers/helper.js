const randomMovies = database => database[Math.floor(Math.random() * database.length)];

const responseObject = (message, count, data) => ({ message, count, data });

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

module.exports = {
    convertedArray,
    randomMovies,
    responseObject,
    filtredMoviesDependOnData,
    sortedArrayByMatchesGenres
}
