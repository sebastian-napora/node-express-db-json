const fs = require('fs');
const { promisify } = require('util');

const modifiedJsonData = (value, jsonName) => {
    return jsonName === "Parse" ? JSON.parse(value) : JSON.stringify(value, null, 2)
};

const jsonReader = (filePath, callback) => {
    return fs.readFile(filePath, (err, fileData) => {
        if (err) return callback && callback(err)

        try {
            const object = modifiedJsonData(fileData, "Parse")
            return callback && callback(null, object)
        } catch(err) {
            return callback && callback(err)
        }
    })
};

const jsonWriter = (filePath, updateDb) => {
    return fs.writeFile(filePath, modifiedJsonData(updateDb, "Stringify"), 'utf8', err => {
        if (err) return console.log('Error writing file:', err)
    })
};

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

module.exports = {
    jsonWriter,
    jsonReader,
    readFile,
    writeFile,
    modifiedJsonData
}