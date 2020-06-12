const Movies = require('../models/movies')
const path = require('path')
const fs = require('fs');
let db = require('../../data/db.json');

function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            return cb && cb(err)
        }
        try {
            const object = JSON.parse(fileData)
            return cb && cb(null, object)
        } catch(err) {
            return cb && cb(err)
        }
    })
}

module.exports = function(router) {
    router.get('/all-movies', (req, res, next) => {
        res.status(200).json({ 
            message: 'GET ALL MOVIES',
            count: db.movies.length,
            data: db.movies
        })
    })

    router.get('/filter-movies?:genres', (req, res, next) => {
        const genresByQuery = req.query.genres;
        const selectedGenres = genresByQuery.split(',');

        const filteredMovies = db.movies.filter(movie => {
            return movie.genres.some(genre => selectedGenres.includes(genre))
        })

        const convertedArray = array => sortedArrayByMatchesGenres(array.map(movie => ({
                ...movie,
                genres: movie.genres,
                matchedGenres: countedMatchingGenres(movie)
            })
        ))

        const countedMatchingGenres = movie => {
            return movie.genres
                .map(genre => selectedGenres.includes(genre))
                .filter(b => b === true).length
        }

        const sortedArrayByMatchesGenres = array => array.sort((a, b) => b.matchedGenres - a.matchedGenres);

        res.status(200).json({ 
            message: 'FILTRED MOVIES BY CATEGORIES',
            count: convertedArray(filteredMovies).length,
            data: convertedArray(filteredMovies)
        })
    })

    router.post('/', (req, res, next) => {

        const { name, price, id } = req.body
        const { error, value }  = Movies.validate({
            id,
            name,
            price
        })

        if(error) {
            res.status(500).json({ error: error.message })
        } else {
            const jsonString = JSON.stringify(value, null, 2)
            jsonReader('./data/dbs.json', (err, data) => {
                if(err) {
                    console.log('Error reading file: ', err);
                    return
                }
                var arrayOfObjects = data;
                    arrayOfObjects.users.push(jsonString)

                fs.writeFile('./data/dbs.json', JSON.stringify(arrayOfObjects), (err) => {
                    if (err) console.log('Error writing file:', err)
                })
            })
            res.status(200).json({
                status: 'success',
                message: 'Videos created successfully',
                data: value
            });
        }
    })

    return router
}
