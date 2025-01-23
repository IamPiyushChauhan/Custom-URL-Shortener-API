const { getDeviceType, getOsType, generateShortUrl } = require('../utils/apiUtils');
const { saveUrlAndGetCreatedAt } = require('../service/urlService');
const {  saveAnalytics, getAliasDetails, getTopicDetails, getAllUrlAnalytics } = require('../service/analyticsService');
require('dotenv').config();

const postUrlShorten = async (req, res) => {
    try {
        const { longUrl, customAlias, topic } = req.body;
        const email = req.user.email;
        const shortUrl = customAlias || generateShortUrl();
        const createdAt  =  await saveUrlAndGetCreatedAt(longUrl, shortUrl, customAlias, topic, email);
        return res.status(201).json({
            shortUrl: `${process.env.BASE_URL}/api/shorten/${shortUrl}`,
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


const getAnalyticsAlias = async (req, res) =>{
    const { alias } = req.params;
    const userEmail = req.user.email;
    try {
        const aliasData = await getAliasDetails(alias,userEmail);
        return res.status(200).json({
            ...aliasData
        });
        
    } catch (error) {
        console.error('Error retrieving analytics:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const  getAnalyticsTopic = async (req, res) =>{
    const { topic } = req.params;
    const userEmail = req.user.email;
    try {
       const topicData =  await getTopicDetails(topic, userEmail);
       return res.status(200).json({
        ...topicData
    });
    } catch (error) {
        console.error("Error fetching analytics by topic:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getOverallAnalytics = async (req, res) =>{
    const userEmail = req.user.email;
    try {
       const topicData =  await getAllUrlAnalytics(userEmail);
       return res.status(200).json({
        ...topicData
    });
    } catch (error) {
        console.error('Error fetching overall analytics:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    postUrlShorten,
    getRedirectUrl,
    getAnalyticsAlias,
    getAnalyticsTopic,
    getOverallAnalytics
};