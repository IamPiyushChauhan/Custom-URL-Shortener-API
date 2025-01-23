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


const getTopicDetails = async(topic, creatorEmail) =>{
    const analytics = await AnalyticsModel.aggregate([
        { $match: { topic , creatorEmail} },
        {
            $group: {
                _id: "$alias",
                totalClicks: { $count: {} },
                uniqueUsers: { $addToSet: "$ipAddress" },
                timestamps: { $push: "$timestamp" }
            }
        }
    ]);
    console.log({analytics})
    const totalClicks = analytics.reduce((sum, data) => sum + data.totalClicks, 0);
    const uniqueUsersSet = new Set(analytics.flatMap(data => data.uniqueUsers));
    const uniqueUsers = uniqueUsersSet.size;

    // Calculate clicks by date
    const clicksByDateMap = new Map();
    analytics.forEach(data => {
        data.timestamps.forEach(timestamp => {
            const date = timestamp.toISOString().split('T')[0];
            clicksByDateMap.set(date, (clicksByDateMap.get(date) || 0) + 1);
        });
    });
    const clicksByDate = Array.from(clicksByDateMap.entries()).map(([date, clicks]) => ({ date, clicks }));

    // Transform aggregated results
    const urls = analytics.map(data => ({
        shortUrl: data._id,
        totalClicks: data.totalClicks,
        uniqueUsers: data.uniqueUsers.length
    }));

    return{
        totalClicks,
        uniqueUsers,
        clicksByDate,
        urls
    };
}

const getAllUrlAnalytics = async(creatorEmail) => {
    const totalUrls = await AnalyticsModel.distinct('alias', { creatorEmail });
    const totalClicks = await AnalyticsModel.countDocuments({ creatorEmail });

  
    const uniqueUsers = await AnalyticsModel.distinct('ipAddress', { creatorEmail });

    const clicksByDate = await AnalyticsModel.aggregate([
        { $match: { creatorEmail } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                totalClicks: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    const osType = await AnalyticsModel.aggregate([
        { $match: { creatorEmail } },
        {
            $group: {
                _id: '$osType',
                uniqueClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: '$ipAddress' },
            },
        },
        {
            $project: {
                osName: '$_id',
                uniqueClicks: 1,
                uniqueUsers: { $size: '$uniqueUsers' },
            },
        },
    ]);

    const deviceType = await AnalyticsModel.aggregate([
        { $match: { creatorEmail } },
        {
            $group: {
                _id: '$deviceType',
                uniqueClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: '$ipAddress' },
            },
        },
        {
            $project: {
                deviceName: '$_id',
                uniqueClicks: 1,
                uniqueUsers: { $size: '$uniqueUsers' },
            },
        },
    ]);

    return {
        totalUrls,
        totalClicks,
        uniqueUsers,
        clicksByDate: clicksByDate.map(({ _id, totalClicks }) => ({
            date: _id,
            totalClicks,
        })),
        osType,
        deviceType,
    };

}

module.exports  = {
    saveAnalytics,
    getAliasDetails,
    getTopicDetails,
    getAllUrlAnalytics

}