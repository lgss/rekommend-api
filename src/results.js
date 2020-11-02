const db = require('./db');
const {v4: uuidv4 } = require('uuid')

const tableName = process.env.TABLE_NAME;
const { createResponse } = require('./util');

exports.submitAssessment = (event) => {
  let reqBody = JSON.parse(event.body)

  // 1) work out relevant resources
  // 2) save response and resources into DB for analytics etc under random ID
  // 3) return resources and ID
  // 4) (on the client) set URL as this ID
}

exports.getAssessmentResults = (event) => {
  let id = event.pathParameters ? event.pathParameters.journeyid : null

  // return results for a particular assessment
}