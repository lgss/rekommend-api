exports.createResponse = (statusCode, body, headers, extraHeaders) => {
  if (!headers)
    headers = {"Access-Control-Allow-Origin": "*"}
  return {
    statusCode, 
    body,
    headers: {...headers, ...extraHeaders}
  }
}
