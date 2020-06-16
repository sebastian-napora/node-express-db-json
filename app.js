const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const createError = require('http-errors');

const config = require('./config');
const { logErrors } = require('./api/helpers/error');
const movies = require('./api/routes/movies');

async function startServer() {
    const app = express();
    
    app.use(morgan('dev'));
    
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());      
    
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
    
    app.use((req, res, next) => {
        next(new createError(404, 'Not found'));
    })
    
    app.use((error, req, res, next) => {
        res.status(error.status || 400);
        res.json({
            error: {
                status: error.status || 400,
                message: error.message
            }
        });
    });

    app.use(logErrors);

    app.listen(config.port, err => {
        if (err) {
            console.error(err);
            process.exit(1);
            return;
        };
        console.log(`start server on port ${config.port}`);
    });
};

startServer();
