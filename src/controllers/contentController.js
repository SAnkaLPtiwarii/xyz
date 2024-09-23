const Content = require('../models/Content');
const contentModel = require('../models/contentModel');

exports.getContent = async (req, res) => {
    try {
        const { keyword } = req.query;
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
        res.json(content);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
};

