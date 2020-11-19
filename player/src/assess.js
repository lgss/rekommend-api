const db = require('../../db');
const utils = require('../../util');
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

exports.compileResults = (event, context, callback) => {

  const responses = JSON.parse(event.body).responses

  // strip out response tags (player)
  let responseTags = utils.getResponseTags(responses);

  // load all the resources into memory from DB (api)
  let params = {
    TableName: tableName,
    FilterExpression: 'contains(#attribute , :input)',
    ExpressionAttributeNames: { '#attribute': 'type' },
    ExpressionAttributeValues: { ':input': 'resource' },
  };
  resources = []
  this.dynamo.scan(params, (err, data) => {
    if (err) {
      console.error(err)
    } else {
      resources = data
      data.Items.forEach(function (item) {
        console.log(" -", item.id);
      });
    }
  })

  // match responses to resources (player)
  let filteredResourceList = resources.filter(
    (resource) =>
      utils.intersects(
        resource.doc.includeTags,
        responseTags
      ) &&
      !utils.intersects(
        resource.doc.excludeTags,
        responseTags
      )
  );

  // generate result Id (new)
  let newId = uuidv4();

  // save responses, result, and Id back to the DB
  params = {
    TableName: tableName,
    Item: {
      "id": newId,
      "type": "result",
      "createdAt": new Date().toISOString(),
      "responses": JSON.stringify(responses),
      "resources": JSON.stringify(filteredResourceList)
    }
  }
  this.dynamo.put(params, (err, data) => {
    if (err) {
      console.error(err)
    } else {
      console.log("Added item " + newId)
    }
  });

  // respond with Id
  return utils.createResponse(201, JSON.stringify(newId))
}

exports.sendResults = (event) => {
  // load result from DB <- constant time
}