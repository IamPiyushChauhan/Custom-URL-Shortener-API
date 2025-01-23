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



const getAliasDetails = async(alias, creatorEmail)=> {
    //  Get Total Total Clicks
    const totalClicks = await AnalyticsModel.countDocuments({ alias, creatorEmail });
    // Get Total Unique User
    const uniqueUsers = await AnalyticsModel.distinct('ipAddress', { alias, creatorEmail }).then((ips) => ips.length);

    // Aggregate clicks by date for the past 7 days
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 7);

    const clicksByDate = await AnalyticsModel.aggregate([
        { $match: { alias, creatorEmail, timestamp: { $gte: dateLimit } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                clickCount: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]).then((data) =>
        data.map((entry) => ({ date: entry._id, clickCount: entry.clickCount }))
    );

    const osType = await AnalyticsModel.aggregate([
        { $match: { alias, creatorEmail } },
        {
            $group: {
                _id: '$osType',
                uniqueClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: '$ipAddress' }
            }
        },
        {
            $project: {
                osName: '$_id',
                uniqueClicks: 1,
                uniqueUsers: { $size: '$uniqueUsers' }
            }
        }
    ]);

    const deviceType = await AnalyticsModel.aggregate([
        { $match: { alias, creatorEmail } },
        {
            $group: {
                _id: '$deviceType',
                uniqueClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: '$ipAddress' }
            }
        },
        {
            $project: {
                deviceName: '$_id',
                uniqueClicks: 1,
                uniqueUsers: { $size: '$uniqueUsers' }
            }
        }
    ]);

    return {
        totalClicks,
        uniqueUsers,
        clicksByDate,
        osType,
        deviceType
    };
}


module.exports  = {
    saveAnalytics,
    getAliasDetails
}