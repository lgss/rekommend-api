const db = require('db');
const {v4: uuidv4 } = require('uuid')

exports.create = (event, context, callback) => {
    const id = event.pathParameters.parentid | uuidv4()
    let reqBody = JSON.parse(event.body);
    let item = {
        id,
        sort: db.sortkey.parent,
        modified: new Date().toISOString(),
        label: reqBody.label,
        img: reqBody.img,
        journeys: reqBody.journeys
    };
    return db.simple_put(item)
}

exports.delete = (event, context, callback) => {
    return db.delete_item(event.pathParameters.parentid, db.sortkey.parent);
}