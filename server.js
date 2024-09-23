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
// new

app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
let isConnected = false;

const connectToDatabase = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log('New database connection established');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        next(error);
    }
});
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

app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
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


