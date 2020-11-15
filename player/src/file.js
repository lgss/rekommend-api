const AWS = require('aws-sdk');
const s3 = new AWS.S3()

const bucketName = process.env.BUCKET_NAME;

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