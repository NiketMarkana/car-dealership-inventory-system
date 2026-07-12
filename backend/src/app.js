const express = require('express');
const cors = require('cors');
const authRoutes = require('./modules/auth/auth.routes');
const notFoundMiddleware = require('./middleware/notFound.middleware');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Car Dealership Inventory System API is healthy',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Module routes
app.use('/api/auth', authRoutes);

// Fallback middlewares
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
