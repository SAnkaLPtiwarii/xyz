const Content = require('../models/Content');
const contentModel = require('../models/contentModel');

exports.getContent = async (req, res) => {
    try {
        const { keyword } = req.query;
        console.log('Fetching content for keyword:', keyword); // Add this log
        let content = await Content.findOne({ keyword });
        if (!content) {
            console.log('Content not found, creating new'); // Add this log
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
        console.error('Error in getContent:', error); // Add this log
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
};
