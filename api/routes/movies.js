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

    router.get('/filter-movies/:duration?/:genres?', (req, res, next) => {
        const genresByQuery = req.query.genres;
        const duration = req.query.duration;

        const database = db.movies;
        const durationBeetween = [+duration - 10, +duration, +duration + 10]

        const filteredMoviesByDuration = database.filter(({ runtime }) => durationBeetween.includes(+runtime));
        const randoMovies = database => database[Math.floor(Math.random() * database.length)]
        const filtredMoviesDependOnData = (data, selectedGenres) => {
            return data.filter(({ genres }) => genres.some(genre => selectedGenres.includes(genre)))
        }


        if(genresByQuery) {
            const selectedGenres = genresByQuery.split(',');
            let filteredMovies;

            if(duration) {
                filteredMovies = filtredMoviesDependOnData(filteredMoviesByDuration, selectedGenres);
            } else {
                filteredMovies = filtredMoviesDependOnData(database, selectedGenres);
            }
    
            const convertedArray = array => sortedArrayByMatchesGenres(array.map(movie => ({
                    ...movie,
                    genres: movie.genres,
                    matchedGenres: countedMatchingGenres(movie)
                })
            ))
    
            const countedMatchingGenres = ({ genres }) => {
                return genres
                    .map(genre => selectedGenres.includes(genre))
                    .filter(b => b === true).length
            }
    
            const sortedArrayByMatchesGenres = array => array.sort((a, b) => b.matchedGenres - a.matchedGenres);
    
            res.status(200).json({ 
                message: 'FILTRED MOVIES BY DURATION AND CATEGORIES',
                count: convertedArray(filteredMovies).length,
                data: convertedArray(filteredMovies)
            })
        } else if (duration) {
            res.status(200).json({ 
                message: 'GET RANDOM MOVIES BY DURATION',
                count: 1,
                data: randoMovies(filteredMoviesByDuration)
            })
        } else {
            res.status(200).json({ 
                message: 'GET RANDOM MOVIES',
                count: 1,
                data: randoMovies(database)
            })
        }
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
