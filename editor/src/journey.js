const db = require('db');
const {createResponse} = require('utils')
const {v4: uuidv4 } = require('uuid')

exports.delete = (event) => {
    return db.delete_item(event.pathParameters.journeyid, db.sortkey.journey);
}

exports.put = (event) => {
    const id = event.pathParameters.journeyid | uuidv4()
    let body = JSON.parse(event.body)
    body.id = id
    body.sort = db.sortkey.journey
    
    return db.put({
        TableName: db.tableName,
        Item: body
    }).promise()
    .then(res => {
        if (event.pathParameters.journeyid)
            return createResponse(204)
        return createResponse(201, "Journey created", extraHeaders = {JourneyID: id})
    })
    .catch(err => createResponse(err.statusCode, JSON.stringify(err)))
}