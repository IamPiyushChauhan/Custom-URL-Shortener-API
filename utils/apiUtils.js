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

const getDeviceType = (userAgent) => {
    if (userAgent.includes('Mobi') || userAgent.includes('Android') || userAgent.includes('iPhone') || userAgent.includes('android')|| userAgent.includes('iphone')) {
        return 'mobile';
    } else if (userAgent.includes('Macintosh') || userAgent.includes('Windows') || userAgent.includes('Linux') || userAgent.includes('Windows') || userAgent.includes('Win64') || userAgent.includes('Win32') || userAgent.includes('macOS') || userAgent.includes('Macintosh' || userAgent.includes('windows')) || userAgent.includes('Window')) {
        return 'desktop';
    }
    return 'unknown';
};

const getOsType = (userAgent) => {
    if (userAgent.includes('Android') || userAgent.includes('android')) return 'android';
    if (userAgent.includes('iPhone') || userAgent.includes('iphone')) return 'iOS';
    if (userAgent.includes('Windows') || userAgent.includes('Win64') || userAgent.includes('Win32') || userAgent.includes('windows') || userAgent.includes('window') || userAgent.includes('Window')) return 'windows';
    if (userAgent.includes('Mac OS X') || userAgent.includes('macOS') || userAgent.includes('Macintosh') || userAgent.includes('macintosh') || userAgent.includes('mac')) return 'macOS'; 
    if (userAgent.includes('Linux') || userAgent.includes('linux')) return 'linux';
    return 'Unknown';
};



module.exports ={
    generateShortUrl,
    isValidateUrl,
    getDeviceType,
    getOsType,
}