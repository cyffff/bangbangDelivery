const { logger } = require('../utils/logger');
const bcrypt = require('bcryptjs');
const dbPromise = require('../models');

// Helper to get DB
const getDB = async () => {
  return await dbPromise;
};

// Create a new user
exports.create = async (req, res) => {
  try {
    const db = await getDB();
    const User = db.User;
    const { Op } = db.Sequelize;
    
    // Check if email or username already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: req.body.email },
          { username: req.body.username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email or username already in use'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      address: req.body.address,
      role: req.body.role || 'user'
    });

    // Return user without password
    const { password, ...userWithoutPassword } = user.toJSON();
    res.status(201).json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    logger.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
};

// Get all users with pagination
exports.findAll = async (req, res) => {
  try {
    const db = await getDB();
    const User = db.User;
    
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const offset = page * limit;

    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: rows
    });
  } catch (error) {
    logger.error('Error retrieving users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message
    });
  }
};

// Find a single user by ID
exports.findOne = async (req, res) => {
  try {
    const db = await getDB();
    const User = db.User;
    
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error(`Error retrieving user with id ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user',
      error: error.message
    });
  }
};

// Update a user
exports.update = async (req, res) => {
  try {
    const db = await getDB();
    const User = db.User;
    const { Op } = db.Sequelize;
    
    // Check if user exists
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If updating email/username, check if already in use
    if (req.body.email || req.body.username) {
      const existingUser = await User.findOne({
        where: {
          [Op.and]: [
            { id: { [Op.ne]: req.params.id } },
            {
              [Op.or]: [
                { email: req.body.email || '' },
                { username: req.body.username || '' }
              ]
            }
          ]
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email or username already in use'
        });
      }
    }

    // If password is provided, hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    // Update user
    await user.update(req.body);

    // Return updated user without password
    const { password, ...userWithoutPassword } = user.toJSON();
    res.status(200).json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    logger.error(`Error updating user with id ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// Delete a user
exports.delete = async (req, res) => {
  try {
    const db = await getDB();
    const User = db.User;
    
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.destroy();
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting user with id ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
}; 