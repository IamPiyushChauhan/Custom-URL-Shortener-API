const { getUrlDataByAlias } = require('../service/urlService');
const redis = require("../redis-client");

const validateAlias = async (req, res, next) => {
    try {
        const alias = req.params.alias;
        const cacheData = await redis.get(alias);
        if(cacheData){
            console.log({rediscacheData: JSON.parse(cacheData)})
            req.urlDoc =  JSON.parse(cacheData);
        }else{
            const urlDoc = await getUrlDataByAlias(alias);

            if (!urlDoc) {
                return res.status(404).json({ message: "Short URL not found" });
            }
            console.log({middle_urlDoc: urlDoc})
            const _id = urlDoc._id.toString();
            await redis.set(alias, JSON.stringify({_id, originalUrl: urlDoc.originalUrl, shortUrl: urlDoc.shortUrl,topic: urlDoc.topic, email: urlDoc.email}));
            req.urlDoc = urlDoc;
        }

        next();
    } catch (error) {
        console.error('Error validating alias:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = validateAlias;
