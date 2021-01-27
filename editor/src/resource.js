const db = require('db');
const { v4: uuidv4 } = require('uuid')
const https = require('https');
const tableName = process.env.TABLE_NAME;

exports.get = (event) => {
    if (event.pathParameters && event.pathParameters.resourceid)
        return db.get_item(event.pathParameters.resourceid, db.sortkey.resource);

    return db.simple_scan(db.sortField, db.sortkey.resource);
}

exports.put = (event) => {
    let item = {
        id: event.pathParameters.resourceid || uuidv4(),
        sort: db.sortkey.resource,
        modified: new Date().toISOString(),
        doc: JSON.parse(event.body)
    };
    return db.simple_put(item);
}

exports.delete = (event) => {
    return db.delete_item(event.pathParameters.resourceid, db.sortkey.resource);
}

exports.check_url = async (event) => {
    let decodeUrl = Buffer.from(event.pathParameters.url, 'base64').toString();
    const response = await new Promise((resolve, reject) => {
        const req = https.get(decodeUrl, function (res) {
            resolve({
                statusCode: 200,
                body: JSON.stringify(res.statusCode)
            });
        });
        req.on('error', (e) => {
            reject({
                statusCode: 500,
                body: 'Error'
            });
        });
    });
    return response;
}

exports.check = async (event) => {

    const transitionPromise = () => {
        let tparams = {
            TableName: tableName,
            Key: {
                id: event.pathParameters.resourceid,
                sort: db.sortkey.resource
            },
            ProjectionExpression: "doc.moreInfoUrl"
        };
        return db.dynamo.get(tparams).promise()
    }

    return transitionPromise().then((data) => {

        let urlToCheck = data.Item.doc.moreInfoUrl
        console.log(`Checking url: "${urlToCheck}`)
        return new Promise((resolve, reject) => {
            const req = https.get(urlToCheck, function (res) {
                resolve({
                    statusCode: 200,
                    body: JSON.stringify(res.statusCode)
                });
            });
            req.on('error', (e) => {
                reject({
                    statusCode: 500,
                    body: 'Error'
                });
            });

        })

    })
}
