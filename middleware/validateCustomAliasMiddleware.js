const URL = require('../model/urlsModel'); 
const validateCustomAlias = async (req, res, next) => {
    const { customAlias } = req.body;

    if (customAlias) {
        try {
            const existingAlias = await URL.findOne({ shortUrl: customAlias });
            if (existingAlias) {
                return res.status(409).json({ error: 'Custom alias already in use' });
            }
        } catch (error) {
            console.error('Error checking custom alias:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    next();
};


module.exports = validateCustomAlias;
