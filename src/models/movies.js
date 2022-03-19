const { modifiedJsonData, readFile, writeFile } = require('./utils')
const { DB_PATH } = require('../constants')

module.exports = class Movies {
  constructor() {
    this.data = this.#readDbData()
  }

  /**
   * @method getAll
   * @async
   * @description This method takes all available movies.
   */
  async getAll() {
    const data = await this.data
    return data
  }

  /**
   * @method readDbData
   * @private
   * @async
   * @description This method takes data from db.json file and read.
   */
  async #readDbData() {
    const result = await readFile(DB_PATH, { encoding: 'utf8' })
    return result
  }

  /**
   * @method create
   * @async
   * @description This method created a new movie. Added to db.json.
   */
  async create(movie) {
    // get all available movies to promise
    const promiseDbData = await this.data
    // take a result of promiseDbData
    const result = modifiedJsonData(promiseDbData, 'Parse')
    // here we pushed a new movie
    result.movies.push(movie)
    // updated db.json file
    return writeFile(DB_PATH, modifiedJsonData(result, 'Stringify'))
  }
}
