const db = require('./db');

exports.setGeneral = (event, context, callback) => {
  const body = JSON.parse(event.body);
  db.simple_create(null, {
    id: "GENERAL",
    landing: body.landing,
    primary: body.primary,
    title: body.title
  }, callback)
}

exports.loadGeneral = (event, context, callback) => {
  db.get_item("GENERAL", callback)
}