'use strict';
const Resource = require('./resource.js')
const Journey = require('./journey.js')
const AWS = require('aws-sdk');

const createResponse = (statusCode, body) => ({ statusCode, body, headers: {"Access-Control-Allow-Origin": "*"}});

exports.journeys = (event, context, callback) => {
    switch (event.httpMethod) {
        // add a resources file
        case "POST": return Journey.POST(event,context,callback)
        // get a single resources file or list of resources files
        case "GET": return Journey.GET(event, context, callback)
        // update an existing journey
        case "PUT": return Journey.PUT(event, context, callback)
        // delete a resources file
        case "DELETE": return Journey.DELETE(event, context, callback)
        // http method not supported
        default:
            const message = "Unsupported HTTP method";
            callback(null, createResponse(500, message));
    }
};

exports.resources = (event, context, callback) => {
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