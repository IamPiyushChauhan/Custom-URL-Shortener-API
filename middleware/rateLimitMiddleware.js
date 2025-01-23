const redis = require("../redis-client");

const rateLimit = async(req, res, next) =>{
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
    
    const noOfRequest = await redis.incr(ip);
   
    if(noOfRequest == 1){
        await redis.expire(ip, 60)
    }

    if(noOfRequest >= 5){
        res.status(429).json({ip, noOfRequest, errorMessage: "too many request" });
    }else{
        next();
    }
}

module.exports = rateLimit;