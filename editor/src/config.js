const db = require('../../db');

exports.setContent = (event, context, callback) => {
  const body = JSON.parse(event.body);
  db.simple_create(null, {
    id: "CONTENT_" + event.pathParameters.contentId.toUpperCase(),
    title: body.title,
    content: body.content
  }, callback)
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