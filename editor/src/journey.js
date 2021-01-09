const db = require('db');
const {createResponse} = require('utils')
const {v4: uuidv4 } = require('uuid')

exports.delete = (event) => {
    return db.delete_item(event.pathParameters.journeyid, db.sortkey.journey);
}

exports.put = (event) => {
    let body = JSON.parse(event.body)
    body.id = event.pathParameters.journeyid
    body.sort = db.sortkey.journey

    return db.simple_put(body)
}