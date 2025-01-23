const UrlModel = require('../model/urlsModel');
const redis = require("../redis-client");

const saveUrlAndGetCreatedAt = async (longUrl, shortUrl, customAlias, topic, email) =>{
    const urlDoc = new UrlModel({
        originalUrl: longUrl,
        shortUrl,
        customAlias,
        topic: topic || 'unknown',
        email
    });

    // Save to MongoDB
    await urlDoc.save();
    
    // Save to Redis
    const _id = urlDoc._id.toString();
    await redis.set(shortUrl, JSON.stringify({_id, originalUrl: urlDoc.originalUrl, shortUrl: urlDoc.shortUrl,topic: urlDoc.topic, email: urlDoc.email}));
  
    return urlDoc.createdAt;
}

const getUrlDataByAlias = async(alias) =>{
    return  await UrlModel.findOne({ shortUrl: alias });
}

module.exports = {
    saveUrlAndGetCreatedAt,
    getUrlDataByAlias
}