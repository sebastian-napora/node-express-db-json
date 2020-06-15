const createError = require('http-errors');
const validator = require('express-joi-validation').createValidator({});

const Movie = require('../models/movie');
const Query = require('../models/query');
const db = require('../../data/db.json');
const {
    convertedArray,
    randomMovies,
    responseObject,
    modifiedJsonData,
    filtredMoviesDependOnData
} = require('../helpers/helper');
const { jsonWriter, jsonReader} = require('../helpers/json');

module.exports = function(router) {
    const database = db.movies;

    router.get('/all-movies', (req, res, next) => {
        if(!database) return next(new createError(404, 'Not founds'));
            res.status(200).json(responseObject('GET ALL MOVIES', database.length, database));
    });

    router.get('/filter-movies/:duration?/:genres?', validator.query(Query), async (req, res, next) => {
        try {
            const genresByQuery = req.query.genres;
            const duration = req.query.duration;

            const durationBetween = [+duration - 10, +duration, +duration + 10];
            const filteredMoviesByDuration = database.filter(({ runtime }) => durationBetween.includes(+runtime));

            if (genresByQuery || duration) {
                let successResponse;
                if(genresByQuery) {
                    const selectedGenres = genresByQuery.split(',');
                    let filteredMovies;

                    duration
                    ? filteredMovies = filtredMoviesDependOnData(filteredMoviesByDuration, selectedGenres)
                        : filteredMovies = filtredMoviesDependOnData(database, selectedGenres);

                    successResponse = responseObject(
                        'MOVIES BY DURATION AND CATEGORIES',
                        convertedArray(filteredMovies, selectedGenres).length,
                        convertedArray(filteredMovies, selectedGenres)
                    );
                } else {
                    successResponse = responseObject('GET RANDOM MOVIES BY DURATION',  1, randomMovies(filteredMoviesByDuration));
                }

                return await res.status(200).json(successResponse);
            } else {
                await res.status(200).json(responseObject('GET RANDOM MOVIES', 1, randomMovies(database)));
            }
        } catch (err) {
            next(new createError(500, err));
        }
    })

    router.post('/', (req, res, next) => {
        const id = database.length + 1;
        const {
            genres,
            title,
            year,
            runtime,
            director,
            actors,
            plot,
            posterUrl
        } = req.body;
        const { error, value: data } = Movie.validate({
            id,
            genres,
            title,
            year,
            runtime,
            director,
            actors,
            plot,
            posterUrl
        });

        if(error) {
            next(error)
        } else {
            const jsonString = modifiedJsonData(data, "Stringify");
            jsonReader('./data/db.json', (err, data) => {
                if(err) return next(createError(404, err))

                const arrayOfObjects = data;
                    arrayOfObjects.movies.push(modifiedJsonData(jsonString, "Parse"));

                jsonWriter('./data/db.json', arrayOfObjects);
                res.status(200).json(responseObject('Movies created successfully', 1, modifiedJsonData(jsonString, "Parse")));
            })
        }
    })

    return router
}
