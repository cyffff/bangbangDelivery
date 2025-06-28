const express = require('express');
const cors = require('cors');
const { logger } = require('./utils/logger');
const userRoutes = require('./routes/userRoutes');

// Import DB as a promise
const dbPromise = require('./models');

// Initialize express app
const app = express();
const PORT = process.env.SERVER_PORT || 8082;

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
    service: 'user-service',
    timestamp: new Date()
  });
});

// Start server function with async DB initialization
const startServer = async () => {
  try {
    // Wait for DB to initialize
    const db = await dbPromise;
    
    // Setup routes with DB access
    app.use('/api/v1/users', userRoutes);
    
    // Sync database
    await db.sequelize.sync({ alter: true });
    
    // After successful sync, add some default users if table is empty
    const result = await db.User.findAndCountAll();
    if (result.count === 0) {
      logger.info('No users found, creating default admin user');
      const bcrypt = require('bcryptjs');
      const salt = bcrypt.genSaltSync(10);
      await db.User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: bcrypt.hashSync('admin123', salt),
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
    }
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`User Service running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Start the server
startServer(); 