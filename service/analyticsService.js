const AnalyticsModel = require('../model/analyticsModel')

const saveAnalytics = async (alias,ipAddress,userAgent, deviceType, osType, topic, creatorEmail) =>{
    const analyticsData = new AnalyticsModel({
        alias,
        ipAddress,
        userAgent,
        deviceType,
        osType,
        topic, 
        creatorEmail
    });
    
    await analyticsData.save();
};


module.exports  = {
    saveAnalytics

}