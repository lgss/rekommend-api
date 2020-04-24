const db = require('./db');

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

exports.get = (event, context, callback) => {
    let id = event.pathParameters ? event.pathParameters.journeyid : null;
    if(id){
        return db.simple_get(event, event.pathParameters.journeyid, callback);
    } else {
        return db.simple_scan(event, 'type', 'journey', callback);
    }
}

exports.create = (event, context, callback) => {
    let reqBody = JSON.parse(event.body);
    let newItem = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        label: reqBody.label,
        doc: reqBody.doc,
        parent: reqBody.parent,
        type: "journey"
    };
    return db.simple_create(event,newItem,callback);
}

exports.delete = (event, context, callback) => {
    return db.simple_delete(event, event.pathParameters.journeyid, callback);
}

exports.update = (event, context, callback) => {
    return db.simple_update(event, event.pathParameters.journeyid, callback);
}