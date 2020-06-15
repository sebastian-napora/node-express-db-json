const fs = require('fs');
const { modifiedJsonData } = require('./helper');

const jsonReader = (filePath, cb) => {
    return fs.readFile(filePath, (err, fileData) => {
        if (err) return cb && cb(err)

        try {
            const object = modifiedJsonData(fileData, "Parse")
            return cb && cb(null, object)
        } catch(err) {
            return cb && cb(err)
        }
    })
};

const jsonWriter = (filePath, updateDb) => {
    return fs.writeFile(filePath, modifiedJsonData(updateDb, "Stringify"), 'utf8', err => {
        if (err) return console.log('Error writing file:', err)
    })
};

module.exports = {
    jsonWriter,
    jsonReader
}