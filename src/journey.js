const db = require('./db');
const {v4: uuidv4 } = require('uuid')

const tableName = process.env.TABLE_NAME;
const {createResponse} = require('./util');

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

exports.compile = (event) => {
    const reqBody = JSON.parse(event.body);

    // The current DB structure is problematic for this, as a crafted
    // request could be used to retrieve other records
    let params = {
        RequestItems: {
            [tableName]: {
                Keys: reqBody.journeys.map(x => {
                    return {id: x }
                }),
                ProjectionExpression: "doc"
            }
        }
    };
    
    return db.dynamo.batchGet(params).promise()
      .then( (data) => {
        const docs = data.Responses[tableName]
        const pages = docs.map(x => x.doc.pages)
        const fields = pages.reduce((a, b) => [...a, ...b])
        const distinct = (value, index, self) => {
            return self.findIndex(x => x.title === value.title) === index 
        }
        const uniqueFields = fields.filter(distinct)
        return createResponse(200, JSON.stringify({"pages": uniqueFields}));
    }).catch( (err) => { 
        console.log(`SIMPLE SCAN FAILED WITH ERROR: ${err}`);
        return createResponse(500, JSON.stringify(err));
    });
}

exports.delete = (event, context, callback) => {
    return db.simple_delete(event, event.pathParameters.journeyid, callback);
}

exports.update = (event, context, callback) => {
    return db.simple_update(event, event.pathParameters.journeyid, callback);
}