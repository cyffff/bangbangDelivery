const { Sequelize } = require('sequelize');
const { logger } = require('../utils/logger');
const mysql = require('mysql2/promise');

// Database configuration
const DB_HOST = process.env.SPRING_DATASOURCE_URL || 'jdbc:mysql://mysql:3306/bangbang_user?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&createDatabaseIfNotExist=true';
const DB_USER = process.env.SPRING_DATASOURCE_USERNAME || 'root';
const DB_PASSWORD = process.env.SPRING_DATASOURCE_PASSWORD || 'rootpassword';

// Parse JDBC URL to extract host, port, and database name
const parseJdbcUrl = (jdbcUrl) => {
  try {
    // Extract the parts after jdbc:mysql://
    const urlParts = jdbcUrl.split('jdbc:mysql://')[1];
    // Split by / to get host:port and database+params
    const [hostPort, dbAndParams] = urlParts.split('/');
    // Get database name (before the ? character)
    const dbName = dbAndParams.split('?')[0];
    
    return {
      host: hostPort.split(':')[0],
      port: hostPort.split(':')[1] || '3306',
      database: dbName
    };
  } catch (error) {
    logger.error('Failed to parse JDBC URL:', error);
    return {
      host: 'mysql',
      port: '3306',
      database: 'bangbang_user'
    };
  }
};

const dbConfig = parseJdbcUrl(DB_HOST);

// Initialize database connection
const initializeDatabase = async () => {
  try {
    // First create the database if it doesn't exist
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: DB_USER,
      password: DB_PASSWORD
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database};`);
    logger.info(`Ensured database ${dbConfig.database} exists`);
    await connection.end();

    // Now connect with Sequelize
    const sequelize = new Sequelize(
      dbConfig.database,
      DB_USER,
      DB_PASSWORD,
      {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: 'mysql',
        logging: (msg) => logger.debug(msg),
        define: {
          charset: 'utf8mb4',
          collate: 'utf8mb4_unicode_ci'
        }
      }
    );

    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    
    return sequelize;
  } catch (error) {
    logger.error('Unable to initialize database:', error);
    throw error;
  }
};

// Create empty DB and Sequelize instances
const db = {};
db.Sequelize = Sequelize;

// Initialize database and export
module.exports = (async () => {
  try {
    // Initialize database and set sequelize instance
    db.sequelize = await initializeDatabase();
    
    // Import models
    db.User = require('./user.model')(db.sequelize, Sequelize);
    
    return db;
  } catch (error) {
    logger.error('Failed to initialize models:', error);
    // Still return db for graceful failure handling
    return db;
  }
})(); 