const fs = require('fs')

function logReqRes(fileName) {
    return (req, res, next) => {
        fs.appendFile(fileName, `ip-address: ${req.ip} ,Date ${Date.now()}: ${req.method}: ${req.path}  \n`, ((err, data) => {
            next()
        }))
    }
}

module.exports = {logReqRes}