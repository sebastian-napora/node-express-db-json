const express = require('express');
const morgan = require('morgan');
const { urlencoded, json } = require('body-parser');
const cors = require('cors');

const { logErrors } = require('./helpers/error');
const movies = require('./routes/movies');

function startServer() {
    const app = express();
    
    app.use(morgan('dev'));
    
    app.use(urlencoded({ extended: false }));
    app.use(json());      
    
    app.use(cors());
  
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

    app.use((error, req, res, next) => {
        res.status(500);
        res.json({
            error: {
                status: 500,
                message: "Something went wrong!"
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