const db = require('db');

exports.setContent = (event) => {
  const body = JSON.parse(event.body);
  return db.simple_put({
    id: event.pathParameters.contentId.toUpperCase(),
    sort: db.sortkey.content,
    title: body.title,
    content: body.content
  })
}

exports.setTheme = (event, callback) => {
  const body = JSON.parse(event.body);
  return db.simple_put({
    id: 'default',
    sort: db.sortkey.theme,
    title: body.title,
    primary: body.primary,
    secondary: body.secondary
  })
}