
exports.compileResults = (event) => {
  // strip out response tags (player)
  // load all the resources into memory from DB (api)
  // match responses to resources (player)
  // generate result Id (new)
  // save responses, result, and Id back to the DB
  // respond with Id
}

exports.sendResults = (event) => {
  // load result from DB <- constant time
}