const db = require('../../db');

exports.get = (event, context, callback) => {
    let id = event.pathParameters ? event.pathParameters.resourceid : null;
    if(id){
        return db.simple_get(event, event.pathParameters.resourceid, callback);
    } else {
        return db.simple_scan(event, 'type', 'resource', callback);
    }
}