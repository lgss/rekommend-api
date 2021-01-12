const db = require('db');
const { createResponse } = require('utils');

exports.loadContent = () => {
  var params = {
    TableName: db.tableName,
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': db.sortkey.content
    },
    ProjectionExpression: 'sort, title, content'
  };
  
  return db.dynamo.query(params).promise()
    .then((data) => {
      return createResponse(200, JSON.stringify(data.Items))
    })
    .catch((err) => {
      console.error(err)
      return createResponse(500, "An error occurred")
    })
}

exports.loadTheme = () => {
  return db.get_item('default', db.sortkey.theme)
}

exports.loadBanners = (event) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: 'default',
      sort: db.sortkey.banner
    }
  }
  return db.dynamo.get(params).promise()
    .then(data => {
      if (data.Item)
        return createResponse(200, JSON.stringify(data.Item.banners))
      
      return createResponse(404, "No banners")
    })

    .catch(err => {
      console.error(err)
      return createResponse(500, "There was an error")
    })
}