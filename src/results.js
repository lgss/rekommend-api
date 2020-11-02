const db = require('./db');
const {v4: uuidv4 } = require('uuid')

const tableName = process.env.TABLE_NAME;
const { createResponse } = require('./util');

function intersects(one, two) {
  return one && two && (one.some(element => two.includes(element)))
}

exports.submitAssessment = (event) => {
  let reqBody = JSON.parse(event.body)

  const selectedTags = 
  const resources = 
  const filteredResources = 
  
  const id = "RESULT_" + v4()

  // 1) work out relevant resources
  // 2) save response and resources into DB for analytics etc under random ID
  // 3) return resources and ID
  // 4) (on the client) set URL as this ID
}

exports.getAssessmentResults = (event) => {
  let id = event.pathParameters ? event.pathParameters.journeyid : null

  // return results for a particular assessment
}

/*
[
   {
      "name":"single-choice-input",
      "choices":[
         {
            "choices":[
               
            ],
            "value":"conditional-input-a",
            "tags":[
               "conditional-input-a"
            ],
            "selected":true
         }
      ]
   },
   {
      "name":"conditional-input-a",
      "choices":[
         {
            "choices":[
               
            ],
            "value":"Yes",
            "tags":[
               
            ],
            "selected":true
         }
      ]
   },
   {
      "name":"halting a",
      "choices":[
         {
            "img":{
               "alt":"jjjjjjj"
            },
            "id":"9066f27a-dba5-49c9-b507-03f0b3e64d33",
            "value":"Continue",
            "tags":[
               
            ],
            "selected":true
         }
      ]
   },
   {
      "name":"halting b",
      "choices":[
         {
            "value":"No",
            "tags":[
               
            ],
            "selected":true
         }
      ]
   },
   {
      "name":"question-one",
      "choices":[
         {
            "choices":[
               
            ],
            "value":"choice-one",
            "tags":[
               
            ],
            "selected":true
         }
      ]
   }
]
*/