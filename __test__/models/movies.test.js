const fs = require('fs')
const { promisify } = require('util')
const Movies = require('../../src/models/movies')
const { modifiedJsonData } = require('../../src/models/utils')
const fakeDataBase = require('../__mocks__/fakeDataBase.json')

jest.mock('../../src/constants', () => ({
  DB_PATH: '__test__/__mocks__/fakeDataBase.json',
}))

describe('Filter movies', () => {
  it('1. should response length be same as mockData length', async () => {
    const result = await new Movies().getAll()

    expect(modifiedJsonData(result, 'Parse').movies.length).toBe(1)
  })

  it('2. should add a new movie to db.json', async () => {
    const data = {
      id: 2,
      title: 'Beetlejuice 2',
      year: '2021',
      runtime: '22',
      genres: ['Fantasy'],
      director: 'Tim Burton 2',
      actors: 'Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page 2',
      plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
      posterUrl:
        'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg',
    }

    // clone db
    const newDB = fakeDataBase
    // pushed new movie to clone db
    newDB.movies.push(data)
    await new Movies().create(data, '__test__/__mocks__/fakeDataBase.json')

    // checked clone db and fakeDatabase length
    expect(newDB.movies.length).toBe(fakeDataBase.movies.length)

    // restore all data in fakeDataBase.json file
    await promisify(fs.writeFile)(
      '__test__/__mocks__/fakeDataBase.json',
      JSON.stringify({
        genres: ['Comedy', 'Fantasy'],
        movies: [
          {
            id: 1,
            title: 'Beetlejuice',
            year: '1988',
            runtime: '92',
            genres: ['Comedy', 'Fantasy'],
            director: 'Tim Burton',
            actors: 'Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page',
            plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
            posterUrl:
              'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg',
          },
        ],
      })
    )
  })
})
