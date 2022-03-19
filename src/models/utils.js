const fs = require('fs')
const { promisify } = require('util')

/**
 * @function modifiedJsonData
 * @description This function take the data and convert to proper output.
 */
const modifiedJsonData = (value, jsonName) =>
  jsonName === 'Parse' ? JSON.parse(value) : JSON.stringify(value, null, 2)

/**
 * @function readFile
 * @description This function takes data from db.json file and read. Parameters: path, coding type.
 */
const readFile = promisify(fs.readFile)
/**
 * @function writeFile
 * @description This function takes data and store in file. Parameters: path, data.
 */
const writeFile = promisify(fs.writeFile)

module.exports = {
  readFile,
  writeFile,
  modifiedJsonData,
}
