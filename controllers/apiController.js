const { getDeviceType, getOsType, generateShortUrl } = require('../utils/apiUtils');
const { saveUrlAndGetCreatedAt } = require('../service/urlService');
const {  saveAnalytics } = require('../service/analyticsService');


const postUrlShorten = async (req, res) => {
    try {
        const { longUrl, customAlias, topic } = req.body;
        const email = req.user.email;
        const shortUrl = customAlias || generateShortUrl();
        const createdAt  =  await saveUrlAndGetCreatedAt(longUrl, shortUrl, customAlias, topic, email);
        return res.status(201).json({
            shortUrl: `${process.env.BASE_URL}/${shortUrl}`,
            createdAt
        });
    } catch (error) {
        console.error('Error creating short URL:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const getRedirectUrl = async (req, res) => {
    const alias = req.params.alias;

    try {
        const { urlDoc } = req;
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
        const userAgent = req.headers['user-agent'];
        const deviceType = req.headers['sec-ch-ua-mobile'] && req.headers['sec-ch-ua-mobile'] == "?1"? "mobile" : "desktop" || getDeviceType(userAgent); 
        const osType =  req.headers['sec-ch-ua-platform'] && getOsType(req.headers['sec-ch-ua-platform']) ||  getOsType(userAgent);
        const topic = urlDoc.topic;
        const creatorEmail = urlDoc.email;
        console.log({urlDoc})
        console.log({alias,ipAddress,userAgent, deviceType, osType, topic, creatorEmail})
        await saveAnalytics(alias,ipAddress,userAgent, deviceType, osType, topic, creatorEmail)
        return res.redirect(urlDoc.originalUrl);
    } catch (error) {
        console.error('Error during URL redirection:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}



module.exports = {
    postUrlShorten,
    getRedirectUrl
};