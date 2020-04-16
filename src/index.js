'use strict';
const Resource = require('./resource.js')
const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const dynamo = new AWS.DynamoDB.DocumentClient();
//const util = require('util');


const tableName = process.env.TABLE_NAME;

const createResponse = (statusCode, body) => ({ statusCode, body, headers: {"Access-Control-Allow-Origin": "*"}});

function simple_create(event, newItem, callback) {
    return dynamo.put({
        TableName: tableName,
        Item: newItem
    }).promise().then(() => {
        callback(null,createResponse(201,JSON.stringify(newItem)));
    })
    .catch(err => callback(null, createResponse(err.statusCode, JSON.stringify(err))));
}

function simple_get(event, ident, callback) {

    let params = {
        TableName: tableName,
        Key: {
            id: ident
        }
    };
    
    let dbGet = (params) => { return dynamo.get(params).promise() };
    
    dbGet(params).then( (data) => {
        if (!data.Item) {
            callback(null, createResponse(404, `ITEM NOT FOUND FOR ${ident}`));
            return;
        }
        console.log(`RETRIEVED ITEM SUCCESSFULLY WITH doc = ${data.Item.doc}`);
        callback(null, createResponse(200, data.Item.doc));
    }).catch( (err) => { 
        console.log(`GET ITEM FAILED FOR doc = ${params.Key.id}, WITH ERROR: ${err}`);
        callback(null, createResponse(500, JSON.stringify(err)));
    });
}

function simple_scan(event, attribute, value, callback) {

    let params = {
        TableName: tableName,
        FilterExpression: 'contains(#attribute , :input)',
        ExpressionAttributeNames: { '#attribute': attribute },
        ExpressionAttributeValues: { ':input': value },
    };
    
    let dbScan = (params) => { return dynamo.scan(params).promise() };
    
    dbScan(params).then( (data) => {
        callback(null, createResponse(200, JSON.stringify(data.Items)));
    }).catch( (err) => { 
        console.log(`SIMPLE SCAN FAILED WITH ERROR: ${err}`);
        callback(null, createResponse(500, JSON.stringify(err)));
    });
}

function simple_delete(event, ident, callback) {
    
    let params = {
        TableName: tableName,
        Key: {
            id: ident
        }
    };

    return dynamo.delete(params)
        .promise()
        .then(() => callback(null, createResponse(200, JSON.stringify({message: 'item deleted successful'}))))
        .catch(err => callback(null, createResponse(err.statusCode, JSON.stringify(err))))

}

function simple_update(event, ident, callback) {
    let id = ident;
    let body = JSON.parse(event.body);

    body.updates.forEach(update => {
        let paramName = update.paramName;
        let paramValue = update.paramValue;
        let params = {
            Key: {
                id: id
            },
            TableName: tableName,
            ConditionalExpression: 'attribute_exists(id)',
            UpdateExpression: 'set ' + paramName + ' = :v',
            ExpressionAttributeValues: {
                ':v': paramValue
            },
            ReturnValue: 'ALL_NEW'
        }
    
        return dynamo.update(params)
            .promise()
            .then(res => {
                callback(null, createResponse(200, JSON.stringify(res)))
            })
            .catch(err => callback(null, createResponse(err.statusCode, JSON.stringify(err))))
    });
}

exports.journeys = (event, context, callback) => {
    let id = event.pathParameters ? event.pathParameters.journeyid : null;

    switch (event.httpMethod) {
        // add a journey
        case "POST":
            let reqBody = JSON.parse(event.body);
            let newItem = {
                id: uuid(),
                createdAt: new Date().toISOString(),
                label: reqBody.label,
                doc: JSON.stringify(reqBody.doc),
                type: "journey"
            };
            return simple_create(event,newItem,callback);
        // get a single journey or list of journeys
        case "GET":
            if(id){
                return simple_get(event, event.pathParameters.journeyid, callback);
            } else {
                return simple_scan(event, 'type', 'journey', callback);
            }
        // update an existing journey
        case "PUT":
            return simple_update(event, event.pathParameters.journeyid, callback);
        // delete a journey
        case "DELETE":
            return simple_delete(event, event.pathParameters.journeyid, callback);
        // http method not supported
        default:
            const message = "Unsupported HTTP method";
            callback(null, createResponse(500, message));
    }
};

exports.terms = (event, context, callback) => {
    let id = 'terms'

    switch (event.httpMethod) {
        // add a journey
        case "POST":
            let reqBody = JSON.parse(event.body);
            let newItem = {
                id: 'terms',
                createdAt: new Date().toISOString(),
                label: reqBody.label,
                doc: JSON.stringify(reqBody.doc),
                type: "terms"
            };
            return simple_create(event,newItem,callback);
        // get a single journey or list of journeys
        case "GET":
            return simple_scan(event, 'type', 'terms', callback);
        // update an existing journey
        case "PUT":
            return simple_update(event, id, callback);
        // http method not supported
        default:
            const message = "Unsupported HTTP method";
            callback(null, createResponse(500, message));
    }
};

exports.resources = (event, context, callback) => {
    //let id = event.pathParameters ? event.pathParameters.resourceid : null;
    //console.log("event: ", util.inspect(event, { showHidden: false, depth: null }));

    switch (event.httpMethod) {
        // add a resources file
        case "POST": return Resource.POST(event,context,callback)
        // get a single resources file or list of resources files
        case "GET": return Resource.GET(event, context, callback)
        // update an existing journey
        case "PUT": return Resource.PUT(event, context, callback)
        // delete a resources file
        case "DELETE": return Resource.DELETE(event, context, callback)
        // http method not supported
        default:
            const message = "Unsupported HTTP method";
            callback(null, createResponse(500, message));
    }
    
};