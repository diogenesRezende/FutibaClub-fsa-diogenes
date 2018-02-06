const crypto = require('crypto')
const alg = 'aes-256-ctr'
const pwd = 'pwdcript'

exports.crypt = function(pass){
    const cipher = crypto.createCipher(alg,pwd)
    const crypted = cipher.update(pass, 'utf8', 'hex')
    return crypted  
}

exports.decrypt = function(pass){
    const decipher = crypto.createDecipher(alg,pwd)
    const plain = decipher.update(pass,'hex', 'utf8')
    return plain
}