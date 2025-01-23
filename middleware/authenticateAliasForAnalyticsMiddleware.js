const { getUrlDataByAlias } = require('../service/urlService');
const redis = require("../redis-client");

const authenticateAliasForAnalytics = async (req, res, next) => {
    try {
        const { alias } = req.params;
        const userEmail = req.user.email;
        const cacheData = await redis.get(alias);
        if(cacheData){
            console.log({rediscacheData: JSON.parse(cacheData)})
            const urlDoc =  JSON.parse(cacheData);
            if(urlDoc.email != userEmail){
                return res.status(401).json({ message: `You are Unauthorized for this endpoint analytics/${alias}` });
            }
        }else{
            const urlDoc = await getUrlDataByAlias(alias);

            if (!urlDoc) {
                return res.status(404).json({ message: "Short URL not found" });
            }
            console.log({middle_urlDoc: urlDoc})
            // Save to Redis
            const _id = urlDoc._id.toString();
            await redis.set(alias, JSON.stringify({_id, originalUrl: urlDoc.originalUrl, shortUrl: urlDoc.shortUrl,topic: urlDoc.topic, email: urlDoc.email}));
            
            if(urlDoc.email != userEmail){
                return res.status(401).json({ message: `You are Unauthorized for this endpoint analytics/${alias}` });
            }
        }

        next();
    } catch (error) {
        console.error('Error validating alias:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = authenticateAliasForAnalytics;
