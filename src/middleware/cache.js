const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

exports.getContent = async (req, res) => {
    const { keyword } = req.query;
    const cacheKey = `content_${keyword}`;

    // Check cache first
    const cachedContent = cache.get(cacheKey);
    if (cachedContent) {
        return res.json(cachedContent);
    }

    try {
        let content = await Content.findOne({ keyword });
        if (!content) {
            content = new Content({
                keyword,
                title: `${keyword} Solutions`,
                subtitle: `Expert ${keyword} Services`,
                mainContent: `We offer top-notch ${keyword} services tailored to your needs.`,
                ctaText: `Get ${keyword} Help`
            });
            await content.save();
        }

        // Store in cache
        cache.set(cacheKey, content);

        res.json(content);
    } catch (error) {
        console.error('Error in getContent:', error);
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
};