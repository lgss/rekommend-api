const AWS = require('aws-sdk');
const {createResponse} = require('utils');

exports.dynamo = new AWS.DynamoDB.DocumentClient();
exports.tableName = process.env.TABLE_NAME;
exports.sortField = 'sort'
exports.sortkey = {
    parent: 'parent',
    journey: 'journey',
    resource: 'resource',
    content: 'content',
    theme: 'theme',
    result: 'result',
    banner: 'banner'
}

exports.get_item = (id, sort, keepId = false) => {
    let params = {
        TableName: tableName,
        Key: {
            id,
            sort
        }
    };
    
    return this.dynamo.get(params).promise()
    .then( (data) => {
        if (!data.Item)
            return createResponse(404);

        if (!keepId)
            delete data.Item.id
        delete data.Item.sort
        return createResponse(200, JSON.stringify(data.Item));
    }).catch((err) => { 
        console.log(`get_item(${id}, ${sort}) failed with ${err}`);
        return createResponse(500, JSON.stringify(err));
    });
}

exports.simple_scan = (attribute, value) => {

    let params = {
        TableName: tableName,
        FilterExpression: '#attribute = :input',
        ExpressionAttributeNames: { '#attribute': attribute },
        ExpressionAttributeValues: { ':input': value },
    };
    
    return this.dynamo.scan(params).promise()
    .then( (data) => {
        return createResponse(200, JSON.stringify(data.Items));
    }).catch( (err) => { 
        console.log(`Scan failed with error: ${err}`);
        return createResponse(500, JSON.stringify(err));
    });
}

exports.delete_item = (id, sort) => {
    let params = {
        TableName: tableName,
        Key: {
            id,
            sort
        }
    };

    return this.dynamo.delete(params)
        .promise()
        .then(() => createResponse(204))
        .catch(err => createResponse(err.statusCode, JSON.stringify(err)))
}

exports.simple_put = (item) => {
    return db.put({
        TableName: db.tableName,
        Item: item
    }).promise()
    .then(res => {
        if (item.id)
            return createResponse(204)
        return createResponse(201, "Created", extraHeaders = {CreatedId: id})
    })
    .catch(err => createResponse(err.statusCode, JSON.stringify(err)))
}

exports.simple_update = (event, ident, callback) => {
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
    
        return this.dynamo.update(params)
            .promise()
            .then(res => {
                callback(null, createResponse(200, JSON.stringify(res)))
            })
            .catch(err => callback(null, createResponse(err.statusCode, JSON.stringify(err))))
    });
}
