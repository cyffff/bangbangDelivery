const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET /api/v1/orders - Get all orders with pagination and filtering
router.get('/', orderController.findAll);

// POST /api/v1/orders - Create a new order
router.post('/', orderController.create);

// GET /api/v1/orders/:id - Get order by ID
router.get('/:id', orderController.findOne);

// PUT /api/v1/orders/:id - Update order details
router.put('/:id', orderController.update);

// PATCH /api/v1/orders/:id/status - Update order status
router.patch('/:id/status', orderController.updateStatus);

// DELETE /api/v1/orders/:id - Delete order
router.delete('/:id', orderController.delete);

module.exports = router; 