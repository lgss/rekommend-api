const db = require('db');

exports.get = (event) => {
    if (event.pathParameters && event.pathParameters.parentid)
        return db.get_item(event.pathParameters.parentid, db.sortkey.parent, true);

    return db.simple_scan(db.sortField, db.sortkey.parent);
}