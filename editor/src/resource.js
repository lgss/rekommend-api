const db = require('db');
const {v4: uuidv4 } = require('uuid')

exports.get = (event) => {
    if (event.pathParameters && event.pathParameters.resourceid)
        return db.get_item(event.pathParameters.resourceid, db.sortkey.resource);

    return db.simple_scan(db.sortField, db.sortkey.resource);
}

exports.put = (event) => {
    const id = event.pathParameters.resourceid | uuidv4()
    let item = {
        id,
        sort: resource_sortkey,
        modified: new Date().toISOString(),
        doc: JSON.parse(event.body)
    };
    return db.simple_put(item);
}

exports.delete = (event) => {
    return db.delete_item(event.pathParameters.resourceid, db.sortkey.resource);
}
