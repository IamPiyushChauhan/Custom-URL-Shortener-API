const crypto = require('crypto');

const generateShortUrl = () =>  {
    return crypto.randomBytes(4).toString('hex');
}

function isValidateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}





module.exports ={
    generateShortUrl,
    isValidateUrl
}