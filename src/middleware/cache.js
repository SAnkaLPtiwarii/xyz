const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

module.exports = (duration) => (req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);
    if (cachedResponse) {
        return res.send(cachedResponse);
    }
    res.originalJson = res.json;
    res.json = (body) => {
        res.originalJson(body);
        cache.set(key, body, duration);
    };
    next();
};