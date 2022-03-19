### MOVIE API to create and find movies in json

#### You can find movie by duration and genres or take random movies.

### Installation

$ npm install or yarn install.

### Running the app

$ npm run start or yarn start.

### Test app

$ npm run test or yarn test.

### How to check/use - Postman or browser paste URL:

Base URL: http://localhost:3000/movies/

1. All movies from DB (GET method): baseURL/movies/all-movies.
2. Filter movies by duration(runtime) or generes (GET method): baseURL/filter-movies/:duration?/:genres
3. Create new movie(only by postman and POST method): baseURL/create-movie
