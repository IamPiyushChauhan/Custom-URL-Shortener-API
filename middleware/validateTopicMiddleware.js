const UrlModel = require('../model/urlsModel');

const validateTopic = async(req, res, next) => {
    const { topic } = req.params;
    const validTopics = ['acquisition', 'activation', 'retention', 'unknown'];

    if (!validTopics.includes(topic)) {
        return res.status(400).json({ message: "Invalid topic provided" });
    }
    next();
};

module.exports = validateTopic;