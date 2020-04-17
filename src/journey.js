const db = require('./db');
const uuid = require('uuid/v4');

exports.GET = (event, context, callback) => {
    let id = event.pathParameters ? event.pathParameters.journeyid : null;
    if(id){
        return db.simple_get(event, event.pathParameters.journeyid, callback);
    } else {
        return db.simple_scan(event, 'type', 'journey', callback);
    }
}

exports.POST = (event, context, callback) => {
    let reqBody = JSON.parse(event.body);
    let newItem = {
        id: uuid(),
        createdAt: new Date().toISOString(),
        label: reqBody.label,
        doc: JSON.stringify(reqBody.doc),
        type: "journey"
    };
    return db.simple_create(event,newItem,callback);
}

exports.DELETE = (event, context, callback) => {
    return db.simple_delete(event, event.pathParameters.journeyid, callback);
}

exports.PUT = (event, context, callback) => {
    return db.simple_update(event, event.pathParameters.journeyid, callback);
}