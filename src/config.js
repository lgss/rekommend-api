const db = require('./db');
const { createResponse } = require('./util');

exports.setContent = (event, context, callback) => {
  const body = JSON.parse(event.body);
  db.simple_create(null, {
    id: "CONTENT_" + event.pathParameters.contentId.toUpperCase(),
    title: body.title,
    content: body.content
  }, callback)
}

exports.loadContent = (event, context, callback) => {
  db.get_item("CONTENT_" + event.pathParameters.contentId.toUpperCase(), callback)
}

exports.setTheme = (event, context, callback) => {
  const body = JSON.parse(event.body);
  db.simple_create(null, {
    id: "THEME",
    title: body.title,
    primary: body.primary,
    secondary: body.secondary
  }, callback)
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