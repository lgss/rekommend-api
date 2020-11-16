const db = require('../../db');
const {v4: uuidv4 } = require('uuid')

exports.create = (event, context, callback) => {
    let newItem = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        doc: JSON.parse(event.body),
        type: "resource"
    };
    return db.simple_create(event,newItem,callback);
}

exports.delete = (event, context, callback) => {
    return db.simple_delete(event, event.pathParameters.resourceid, callback);
}

exports.update = (event, context, callback) => {
    return db.simple_update(event, event.pathParameters.resourceid, callback);
}