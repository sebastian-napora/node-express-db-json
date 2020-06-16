const express = require('express');
const morgan = require('morgan');
const { urlencoded, json } = require('body-parser');
const createError = require('http-errors');

const { logErrors } = require('./src/helpers/error');
const movies = require('./src/routes/movies');

function startServer() {
    const app = express();
    
    app.use(morgan('dev'));
    
    app.use(urlencoded({ extended: false }));
    app.use(json());      
    
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        
        if(req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        };
        next();
    });
    
    app.use('/movies', movies(express.Router()));
    
    app.use(logErrors);

    app.use((req, res, next) => {
        next(new createError(404, 'Not found'));
    })
    
    app.use((error, req, res, next) => {
        res.status(error.status || 400);
        res.json({
            error: {
                status: error.status || 400,
                message: "Something went wrong!" || error.message
            }
        });
    });

    app.listen(3000, err => {
        if (err) {
            console.error(err);
            process.exit(1);
            return;
        };
        console.log(`start server on port 3000`);
    });
};

startServer()
