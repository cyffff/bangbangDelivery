const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/v1/users - Get all users with pagination
router.get('/', userController.findAll);

// POST /api/v1/users - Create a new user
router.post('/', userController.create);

// GET /api/v1/users/:id - Get user by ID
router.get('/:id', userController.findOne);

// PUT /api/v1/users/:id - Update user by ID
router.put('/:id', userController.update);

// DELETE /api/v1/users/:id - Delete user by ID
router.delete('/:id', userController.delete);

module.exports = router; 