const Movie = require('../models/movie');
const db = require('../../data/db.json');
const helper = require('../helpers/helper');

module.exports = function(router) {
    const {
        convertedArray,
        jsonWriter,
        jsonReader,
        randomMovies,
        responseObject,
        modifiedJsonData,
        filtredMoviesDependOnData
    } = helper;
    const database = db.movies;

    router.get('/all-movies', (req, res, next) => {
        res.status(200).json(responseObject('GET ALL MOVIES', database.length, database));
    });

    router.get('/filter-movies/:duration?/:genres?', async (req, res, next) => {
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
            res.status(500).json({ error: error.message });
        } else {
            const jsonString = modifiedJsonData(data, "Stringify");
            jsonReader('./data/db.json', (err, data) => {
                if(err) return res.status(500).json(responseObject('Error reading file', 0, err));
                
                const arrayOfObjects = data;
                    arrayOfObjects.movies.push(modifiedJsonData(jsonString, "Parse"));

                jsonWriter('./data/db.json', arrayOfObjects);
                res.status(200).json(responseObject('Movies created successfully', 1, modifiedJsonData(jsonString, "Parse")));
            })
        }
    })

    return router
}
