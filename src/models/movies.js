const {
    modifiedJsonData,
    readFile,
    writeFile
} = require('./utils');

module.exports = class Movies {
    constructor() {
      this.data = this.readDbData()
    }    
  
    async getAll() {
        return await this.data;
    }

    async readDbData() {
        return await readFile('./data/db.json', { encoding: 'utf8' });
    }

    async create(movie) {
        try {
            const resolvedPromise = await this.data;
            const result = modifiedJsonData(resolvedPromise, "Parse")
                result.movies.push(movie);
                
            return writeFile('./data/db.json',  modifiedJsonData(result, "Stringify"));
        } catch (err) {
            throw Error(err);
        }
    }
}

