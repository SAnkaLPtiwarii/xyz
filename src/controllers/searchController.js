const Content = require('../models/contentModel');

exports.search = async (req, res) => {
    try {
        const { query } = req.query;
        const content = await Content.find({
            $or: [
                { keyword: { $regex: query, $options: 'i' } },
                { title: { $regex: query, $options: 'i' } }
            ]
        }).limit(10);
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: 'Error performing search', error: error.message });
    }
};