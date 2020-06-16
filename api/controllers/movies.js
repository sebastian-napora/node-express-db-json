const { movieSchema } = require('../validation/movie');
const filterMovie = require('./utils');
const db = require('../../data/db.json');
const { jsonWriter, jsonReader, modifiedJsonData } = require('../models/transactions.db');
const { responseObject } = require('../helpers/helper');

module.exports = {
    getAll: (req, res, next) =>{
        res.status(200).json(responseObject('GET ALL MOVIES', db.movies.length, db.movies));
    },
    filtered: (req, res, next) => {
        const genresByQuery = req.query.genres;
        const duration = req.query.duration;    
        
        const resultFilteredMovies = filterMovie({ genresByQuery, duration }, db);

        res.status(200).json(resultFilteredMovies);
    },
    create: (req, res, next) => {
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
            new Error(error);
        } else {
            const jsonString = modifiedJsonData(data, "Stringify");
            jsonReader('./data/db.json', (err, data) => {
                if(err) return next(new Error(err))

                const arrayOfObjects = data;
                    arrayOfObjects.movies.push(modifiedJsonData(jsonString, "Parse"));

                jsonWriter('./data/db.json', arrayOfObjects);
                res.status(201).json(responseObject('Movies created successfully', 1, modifiedJsonData(jsonString, "Parse")));
            })
        }
    }
};



