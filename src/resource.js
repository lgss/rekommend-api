const db = require('./db');

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

exports.get = (event, context, callback) => {
    //const message = "Hello!";
    //callback(null, createResponse(200, message));
    let id = event.pathParameters ? event.pathParameters.resourceid : null;
    if(id){
        return db.simple_get(event, event.pathParameters.resourceid, callback);
    } else {
        return db.simple_scan(event, 'type', 'resource', callback);
    }
}

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