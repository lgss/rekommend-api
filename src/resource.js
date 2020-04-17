const db = require('./db');
const uuid = require('uuid/v4');

exports.GET = (event, context, callback) => {
    //const message = "Hello!";
    //callback(null, createResponse(200, message));
    let id = event.pathParameters ? event.pathParameters.resourceid : null;
    if(id){
        return db.simple_get(event, event.pathParameters.resourceid, callback);
    } else {
        return db.simple_scan(event, 'type', 'resource', callback);
    }
}

exports.POST = (event, context, callback) => {
    let newItem = {
        id: uuid(),
        createdAt: new Date().toISOString(),
        doc: JSON.parse(event.body),
        type: "resource"
    };
    return db.simple_create(event,newItem,callback);
}

exports.DELETE = (event, context, callback) => {
    return db.simple_delete(event, event.pathParameters.resourceid, callback);
}

exports.PUT = (event, context, callback) => {
    return db.simple_update(event, event.pathParameters.resourceid, callback);
}