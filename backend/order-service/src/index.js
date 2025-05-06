const express = require('express');
const cors = require('cors');
const { logger } = require('./utils/logger');
const orderRoutes = require('./routes/orderRoutes');

// Import DB as a promise
const dbPromise = require('./models');

// Initialize express app
const app = express();
const PORT = process.env.SERVER_PORT || 8083;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send({
    status: 'UP',
    service: 'order-service',
    timestamp: new Date()
  });
});

// Start server function with async DB initialization
const startServer = async () => {
  try {
    // Wait for DB to initialize
    const db = await dbPromise;
    
    // Setup routes with DB access
    app.use('/api/v1/orders', orderRoutes);
    
    // Sync database
    await db.sequelize.sync({ alter: true });
    
    // After successful sync, check if we need to create sample data
    const result = await db.Order.findAndCountAll();
    if (result.count === 0) {
      logger.info('No orders found, the system is ready for new orders');
    }
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`Order Service running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Start the server
startServer(); 