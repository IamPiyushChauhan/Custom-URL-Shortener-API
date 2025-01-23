const passport = require('passport');

const authenticateUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        if(req.user.email){
            return next();
        }else{
            return res.status(401).json({ message: "Email is required" });
        }
    } else {
        return res.status(401).json({ message: "Token Expired plz Sigin in again" });
    }
};

module.exports = authenticateUser;
