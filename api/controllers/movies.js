const createError = require('http-errors');

const { movieSchema } = require('../models/movie');
const db = require('../../data/db.json');
const { jsonWriter, jsonReader, modifiedJsonData } = require('../helpers/json');
const {
    convertedArray,
    randomMovies,
    responseObject,
    filtredMoviesDependOnData
} = require('../helpers/helper');

const database = db.movies;

module.exports = {
    getAll: function(req, res, next){
        try {
            res.status(200).json(responseObject('GET ALL MOVIES', database.length, database));
        } catch (err) {
            next(new createError(500, err));
        }
    },
    filterMovies: async function(req, res, next) {
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
    },
    createMovie: function(req, res, next) {
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
                posterUrl
            } = req.body;
            const { error, value: data } = movieSchema.validate({
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
                    res.status(201).json(responseObject('Movies created successfully', 1, modifiedJsonData(jsonString, "Parse")));
                })
            }
        } catch (err) {
            next(err)
        }
    }
};

