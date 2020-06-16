const express = require('express');
const morgan = require('morgan');
const { urlencoded, json } = require('body-parser');

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
        const error = new Error()
        error.status = 404
        error.message = 'Not found'
        next(error)
    })
    
    app.use((error, req, res, next) => {
        res.status(400 || error.status);
        res.json({
            error: {
                status: 400 || error.status,
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
