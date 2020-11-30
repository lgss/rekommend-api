const db = require('db');
const { createResponse } = require('utils');

exports.loadContent = (event, context, callback) => {
  let id = event.pathParameters ? event.pathParameters.contentId : null;
  if (id) {
    db.get_item("CONTENT_" + event.pathParameters.contentId.toUpperCase(), callback)
  } else {
    return db.simple_scan(event, 'id', 'CONTENT_', callback);
  }

}

exports.loadTheme = (event, context, callback) => {
  db.get_item("THEME", callback)
}

exports.loadBanners = (event) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: 'BANNERS'
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