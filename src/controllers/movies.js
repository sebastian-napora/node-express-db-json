const filterMovie = require('./utils');
const { modifiedJsonData } = require('../models/transactions.db');
const { responseObject } = require('../helpers/helper');
const Movies = require('../models/movie');

module.exports = {
    getAll: async (req, res, next) => {
        try {
            const resolvedPromise = await new Movies().getAll();
            const result = modifiedJsonData(resolvedPromise, "Parse")
           
            res.status(200).json(responseObject('GET ALL MOVIES', result.movies.length, result.movies));
        } catch (err) {
            res.status(400).json({ message: 'Something went wrong' });
        }
    },
    filtered: async (req, res, next) => {
        try {
            const genresByQuery = req.query.genres;
            const duration = req.query.duration;  
            
            const resolvedPromise = await new Movies().getAll();
            const result = modifiedJsonData(resolvedPromise, "Parse");
            
            const resultFilteredMovies = filterMovie({ genresByQuery, duration }, result);
            
            res.status(200).json(resultFilteredMovies);
        } catch (err) {
            next(new Error(err))
        }
    },
    create: async (req, res, next) => {
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

        const data = {
            id,
            genres,
            title,
            year,
            runtime,
            director,
            actors,
            plot,
            posterUrl
        };

        await new Movies().create(data);

        await res.status(201).json(responseObject('Movies created successfully', 1, data))
    }
};



