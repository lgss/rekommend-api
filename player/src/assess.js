const db = require('db');
const { createResponse } = require('utils');
const AWS = require('aws-sdk');
exports.dynamo = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME;

const { v4: uuidv4 } = require('uuid')

function intersects(one, two) {
  return one && two && (one.some(element => two.includes(element)))
}
function getResponseTags(responses) {
  return (responses || []).flatMap(x => x.choices).flatMap(x => x.tags)
}

exports.compileResults = (event) => {
  const httpRequest = JSON.parse(event.body)

  if (httpRequest.id) {
    let params = {
      TableName: tableName,
      Key: {
        id: httpRequest.id
      }
    };

    return this.dynamo.get(params).promise()
      .then((data) => {
        if (!data.Item) {
          return createResponse(404);
        }

        return createResponse(200, JSON.stringify(data.Item));
      }).catch((err) => {
        console.log(`compileResults get results failed for id = ${httpRequest.id}, with error: ${err}`);
        return createResponse(500, "Results not found");
      });
  } else {
    const responses = httpRequest.responses

    let responseTags = getResponseTags(responses);

    let params = {
      TableName: tableName,
      FilterExpression: 'sort = :input',
      ExpressionAttributeValues: { ':input': 'resource' },
    };
    let newId = uuidv4();
    let filteredResourceList = []

    return this.dynamo.scan(params).promise()
      .then((data) => {
        const resources = data.Items

        filteredResourceList = resources.filter(
          (resource) =>
            intersects(
              resource.doc.includeTags,
              responseTags
            ) &&
            !intersects(
              resource.doc.excludeTags,
              responseTags
            )
        );

        //store result set in table
        params = {
          TableName: tableName,
          Item: {
            "id": newId,
            "sort": db.sortkey.result,
            "createdAt": new Date().toISOString(),
            "responses": JSON.stringify(responses),
            "resources": JSON.stringify(filteredResourceList)
          }
        }
        
        return this.dynamo.put(params).promise()
          .then(() => {
            return createResponse(
              201, 
              JSON.stringify(filteredResourceList), 
              null, 
              {"Access-Control-Expose-Headers": "ResultsId", ResultsId: newId})
          })
          .catch((err) => {
            console.error(err)
            return createResponse(500, "An error occurred, your results could not be created")
          })
      })
  }
}

exports.sendResults = (event) => {
  // load result from DB <- constant time
  return db.get_item(event.pathParameters.resultId, db.sortkey.result)
}