const { isValidateUrl } = require("../utils/apiUtils");

const validateUrl = (req, res, next) => {
    const { longUrl } = req.body;

    if (!longUrl || !isValidateUrl(longUrl)) {
        return res.status(400).json({ error: 'Invalid URL provided' });
    }

    next();
};

module.exports = validateUrl;
