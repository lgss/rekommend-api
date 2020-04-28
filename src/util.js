exports.createResponse = (statusCode, body) => ({ statusCode, body, headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Headers": "*"}})
