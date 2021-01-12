const db = require('db');

exports.loadContent = (event) => {
  return db.get_item(db.sortkey.content, 'CONTENT_' + event.pathParameters.contentId.toUpperCase())
}

exports.setContent = (event) => {
  const body = JSON.parse(event.body);
  return db.simple_put({
    id: db.sortkey.content,
    sort: 'CONTENT_' + event.pathParameters.contentId.toUpperCase(),
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