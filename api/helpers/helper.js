const fs = require('fs');

const modifiedJsonData = (value, jsonName) => {
    return jsonName === "Parse" ? JSON.parse(value) : JSON.stringify(value, null, 2)
};

const jsonReader = (filePath, cb) => {
    return fs.readFile(filePath, (err, fileData) => {
        if (err) return cb && cb(err)

        try {
            const object = modifiedJsonData(fileData, "Parse")
            return cb && cb(null, object)
        } catch(err) {
            return cb && cb(err)
        }
    })
};

const jsonWriter = (filePath, updateDb) => {
    return fs.writeFile(filePath, modifiedJsonData(updateDb, "Stringify"), 'utf8', err => {
        if (err) return console.log('Error writing file:', err)
    })
};

const randomMovies = database => database[Math.floor(Math.random() * database.length)];

const responseObject = (message, count, data) => ({ message, count, data });

const filtredMoviesDependOnData = (data, selectedGenres) => {
    return data.filter(({ genres }) => genres.some(genre => selectedGenres.includes(genre)))
};

const sortedArrayByMatchesGenres = array => array.sort((a, b) => b.matchedGenres - a.matchedGenres);

const convertedArray = (array, selectedGenres) => sortedArrayByMatchesGenres(array.map(movie => ({
        ...movie,
        genres: movie.genres,
        matchedGenres: countedMatchingGenres(selectedGenres, movie)
    })
));

const countedMatchingGenres = (selectedGenres, { genres }) => {
    return genres
        .map(genre => selectedGenres.includes(genre))
        .filter(isTrue => isTrue === true).length
};

module.exports = {
    convertedArray,
    jsonWriter,
    jsonReader,
    randomMovies,
    responseObject,
    modifiedJsonData,
    filtredMoviesDependOnData,
    sortedArrayByMatchesGenres
}
