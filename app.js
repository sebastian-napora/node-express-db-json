const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config');

const movies = require('./api/routes/movies');
const { handlerError, ErrorHandler } = require('./api/helpers/error');

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
        const error = new Error('Not found');
        error.status = 404;
        next(error);
    })

    app.use((error, req, res, next) => {
        res.status(error.status || 500);
        res.json({
            error: {
                status: error.status || 500,
                message: error.message
            }
        });
    });
    app.use((err, req, res, next) => {
        handlerError(err, res);
    });

    app.listen(config.port, err => {
        if (err) {
            console.error(err);
            process.exit(1);
        return;
        };
        console.log('start server on port 3003');
    });
}

startServer();
