const db = require('db');

exports.get = (event, context, callback) => {
    let id = event.pathParameters ? event.pathParameters.parentid : null;
    if(id){
        return db.simple_get(event, event.pathParameters.parentid, callback);
    } else {
        return db.simple_scan(event, 'type', 'parent', callback);
    }
}