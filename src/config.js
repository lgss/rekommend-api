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

exports.setDisclaimer = (event, context, callback) => {
  const body = JSON.parse(event.body);
  db.simple_create(null, {
    id: "DISCLAIMER",
    title: body.title,
    content: body.content,
  }, callback)
}

exports.loadDisclaimer = (event, context, callback) => {
  db.get_item("DISCLAIMER", callback)
}

exports.setPositiveOutcome = (event, context, callback) => {
  const body = JSON.parse(event.body);
  db.simple_create(null, {
    id: "POSITIVE",
    title: body.title,
    content: body.content,
  }, callback)
}

exports.loadPositiveOutcome = (event, context, callback) => {
  db.get_item("POSITIVE", callback)
}