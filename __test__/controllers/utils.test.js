const filterMovie = require('../../src/controllers/utils')
const db = require('../__mocks__/mockData.json')

describe('Filter movies', () => {
  it('1. should response a filter movies by genres and duration', () => {
    const result = filterMovie({ genresByQuery: 'Comedy', duration: 110 }, db)
    expect(result.data.length).toBe(4)
  })

  it('2. should response a filter movies by genres', () => {
    const result = filterMovie({ genresByQuery: 'Comedy' }, db)
    expect(result.data.length).toBe(36)
  })

  it('3. should response a filter movies by more then one genres', () => {
    const result = filterMovie({ genresByQuery: 'Drama,History' }, db)
    expect(result.data[0].genres.includes('Drama')).toBeTruthy()
    expect(result.data[0].genres.includes('History')).toBeTruthy()
  })

  it('4. should response a filter movies by duration', () => {
    const result = filterMovie({ duration: 110 }, db)
    expect(result.data.length).toBe(1)
  })

  it('5. should return one movie with runtime by duration + - 10', () => {
    const duration = 111
    const result = filterMovie({ duration }, db)
    const expectedResult = +result.data[0].runtime

    expect(expectedResult).toBeGreaterThanOrEqual(duration - 10)
    expect(expectedResult).toBeLessThanOrEqual(duration + 10)
  })

  it('6. should return one random movies when no params', () => {
    const result = filterMovie({}, db)

    expect(result.data.length).toBe(1)
  })
})
