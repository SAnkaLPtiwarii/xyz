require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const bodyParser = require('body-parser');

const logger = require('./src/utils/logger');
const connectDB = require('./src/config/database');
const contentRoutes = require('./src/routes/contentRoutes');
const searchRoutes = require('./src/routes/searchRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(compression());
app.use(bodyParser.json());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Rate Limiter
const rateLimiter = new RateLimiterMemory({
    points: 10,
    duration: 1,
});

app.use((req, res, next) => {
    rateLimiter.consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
            res.status(429).send('Too Many Requests');
        });
});

// Routes
app.use('/api/content', contentRoutes);
app.use('/api/search', searchRoutes);

// Form submission route
app.post('/api/submit-info', async (req, res) => {
    const { name, email, phone, message, service } = req.body;
    logger.info('Received form submission:', { name, email, phone, service });

    try {
        // Here you would typically save this information to your database
        console.log('Form submission:', { name, email, phone, message, service });
        res.json({ success: true, message: 'Information received successfully' });
    } catch (error) {
        logger.error('Error processing form submission:', error);
        res.status(500).json({ error: 'An error occurred while processing your submission' });
    }
});

// Catch-all route to serve index.html for any unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
});

module.exports = app; // For testing purposes


