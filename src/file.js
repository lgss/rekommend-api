const AWS = require('aws-sdk');
const s3 = new AWS.S3()
const {v4: uuidv4 } = require('uuid')

const bucketName = process.env.BUCKET_NAME;

exports.setFileURL = (event, context, callback) => {
        const actionId = uuidv4()
        const fn = `${actionId}.${event['pathParameters']['filename']}`
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

exports.getFileURL = (event, context, callback) => {
  const fn = event.pathParameters.filename
  const s3Params = {
    Bucket: bucketName,
    Key:  fn,
    Expires: 1800,
  }

  return new Promise((resolve, reject) => {
    let srcURL = s3.getSignedUrl('getObject', s3Params)
    resolve({
      "statusCode": 302,
      "isBase64Encoded": false,
      "headers": { "Access-Control-Allow-Origin": "*", "Location":srcURL }
    })
  })
}

exports.deleteFile = (event, context, callback) => {
  const fn = event.pathParameters.filename
  const s3Params = {
    Bucket: bucketName,
    Key:  fn
  }
  return new Promise((resolve, reject) => {
    s3.deleteObject(s3Params, function(err, data) {
      if (err) console.log(err, err.stack);
      else {
        resolve({
          "statusCode": 200,
          "isBase64Encoded": false,
          "headers": { "Access-Control-Allow-Origin": "*" },
          "body": JSON.stringify({
            "outcome": "deleted",
            "aws": data
          })
        });
      }
    });
  });
}