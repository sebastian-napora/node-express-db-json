const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const { logErrors } = require('./helpers/error')
const movies = require('./routes/movies')

function startServer() {
  const app = express()

  app.use(morgan('dev'))

  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())

  // handling cors
  app.use(cors())

  // start app on default route /movies and add other routes
  app.use('/movies', movies())

  // log errors
  app.use(logErrors)

  // log 404 not found
  app.use((req, res, next) => {
    const error = new Error()
    error.status = 404
    error.message = 'Not found'
    next(error)
  })

  // handling error information and statuses
  app.use((error, req, res, next) => {
    res.status(error.status || 400)
    res.json({
      error: {
        status: error.status || 400,
        message: 'Something went wrong!' || error.message,
      },
    })
    next()
  })

  // start server on port 3000
  app.listen(3000, (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
      return
    }
    console.log(`start server on port 3000`)
  })
}

startServer()
