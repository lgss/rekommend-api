const db = require('../../db');
const {v4: uuidv4 } = require('uuid')

exports.create = (event, context, callback) => {
    let reqBody = JSON.parse(event.body);
    let newItem = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        label: reqBody.label,
        doc: reqBody.doc,
        parent: reqBody.parent,
        type: "journey",
        img: reqBody.img,
    };
    return db.simple_create(event,newItem,callback);
}

exports.delete = (event, context, callback) => {
    return db.simple_delete(event, event.pathParameters.journeyid, callback);
}

exports.update = (event, context, callback) => {
    return db.simple_update(event, event.pathParameters.journeyid, callback);
}