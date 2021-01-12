const db = require('db');

const tableName = process.env.TABLE_NAME;
const { createResponse } = require('utils');

exports.get = (event, context, callback) => {
    if (event.pathParameters && event.pathParameters.journeyid)
        return db.get_item(event.pathParameters.journeyid, db.sortkey.journey);

    return db.simple_scan(db.sortField, db.sortkey.journey);
}

exports.compile = (event) => {
    const reqBody = JSON.parse(event.body);

    let params = {
        RequestItems: {
            [tableName]: {
                Keys: reqBody.journeys.map(x => {
                    return {id: x, sort: db.sortkey.journey }
                })
            }
        }
    };

    const transitionPromise = () => {
        let tparams = {
            TableName: tableName,
            Key: {
                id: "TRANSITION",
                sort: db.sortkey.content
            },
            ProjectionExpression: "content"
        };
        return db.dynamo.get(tparams).promise()
    }

    const prependItems = (page, prefix) => {
        return [{'title': 'Transition', 'items': page.Item.content.items}];
    }
    return Promise.all([db.dynamo.batchGet(params).promise(),transitionPromise()])
    .then( ([data,transitionPage]) => {
        const journeys = data.Responses[tableName]
        journeys.forEach(journey => {
            journey.doc.pages.forEach(page => page.journey = journey.label)
        })
        const pages = journeys.map(x => x.doc.pages)
        
        const pages_trans = pages.reduce((acc, cur) => {
            if(acc.length < 1){
                return [...acc, cur]
            } else {
                return [...acc, prependItems(transitionPage, cur[0].journey), cur]
            }
        },[])
        
        const fields = pages_trans.reduce((a, b) => [...a, ...b])
        const distinct = (value, index, self) => {
            return self.findIndex(x => x.title === value.title) === index || value.title == 'Transition'
        }
        const uniqueFields = fields.filter(distinct)
        return createResponse(200, JSON.stringify({"pages": uniqueFields}));
    }).catch( (err) => { 
        console.log(`journey.compile error: ${err}`);
        return createResponse(500, JSON.stringify(err));
    });
}
