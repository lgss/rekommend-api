const AWS = require('aws-sdk');
const s3 = new AWS.S3()
const {v4: uuidv4 } = require('uuid')

const bucketName = process.env.BUCKET_NAME;

exports.getUploadURL = (event, context, callback) => {
        const actionId = uuidv4()
        const fn = `${actionId}.${event['pathParameters']['extension']}`
        const s3Params = {
          Bucket: bucketName,
          Key:  fn,
          Expires: 1800,
        }
        return new Promise((resolve, reject) => {
          let uploadURL = s3.getSignedUrl('putObject', s3Params)
          resolve({
            "statusCode": 200,
            "isBase64Encoded": false,
            "headers": { "Access-Control-Allow-Origin": "*" },
            "body": JSON.stringify({
              "uploadURL": uploadURL,
              "filename": fn
            })
          })
        })
}