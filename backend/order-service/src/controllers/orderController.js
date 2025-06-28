const { logger } = require('../utils/logger');
const dbPromise = require('../models');

// Helper to get DB
const getDB = async () => {
  return await dbPromise;
};

// Create a new order
exports.create = async (req, res) => {
  try {
    const db = await getDB();
    const Order = db.Order;
    const OrderItem = db.OrderItem;
    const { Op } = db.Sequelize;

    // Validate required fields
    if (!req.body.userId || !req.body.totalAmount || !req.body.shippingAddress || !req.body.items || !req.body.items.length) {
      return res.status(400).json({
        success: false,
        message: 'Order data incomplete. Please provide userId, totalAmount, shippingAddress, and items.'
      });
    }

    // Start transaction
    const t = await db.sequelize.transaction();

    try {
      // Create order
      const order = await Order.create({
        userId: req.body.userId,
        totalAmount: req.body.totalAmount,
        status: req.body.status || 'CREATED',
        paymentMethod: req.body.paymentMethod || 'CREDIT_CARD',
        paymentStatus: req.body.paymentStatus || 'PENDING',
        shippingAddress: req.body.shippingAddress,
        deliveryNotes: req.body.deliveryNotes,
        estimatedDeliveryTime: req.body.estimatedDeliveryTime,
        driverId: req.body.driverId
      }, { transaction: t });

      // Create order items
      const orderItems = await Promise.all(
        req.body.items.map(item => 
          OrderItem.create({
            orderId: order.id,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
            notes: item.notes
          }, { transaction: t })
        )
      );

      // Commit transaction
      await t.commit();

      res.status(201).json({
        success: true,
        data: {
          ...order.toJSON(),
          items: orderItems
        }
      });
    } catch (error) {
      // Rollback transaction on error
      await t.rollback();
      throw error;
    }
  } catch (error) {
    logger.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Get all orders with pagination and filtering
exports.findAll = async (req, res) => {
  try {
    const db = await getDB();
    const Order = db.Order;
    const OrderItem = db.OrderItem;

    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const offset = page * limit;
    const userId = req.query.userId;
    const status = req.query.status;

    // Build where clause based on filters
    const whereClause = {};
    if (userId) whereClause.userId = userId;
    if (status) whereClause.status = status;

    const { count, rows } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: 'items'
        }
      ],
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
    logger.error('Error retrieving orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message
    });
  }
};

// Find a single order by ID
exports.findOne = async (req, res) => {
  try {
    const db = await getDB();
    const Order = db.Order;
    const OrderItem = db.OrderItem;

    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: 'items'
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    logger.error(`Error retrieving order with id ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order',
      error: error.message
    });
  }
};

// Update order status
exports.updateStatus = async (req, res) => {
  try {
    const db = await getDB();
    const Order = db.Order;

    if (!req.body.status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status
    const updatedOrder = await order.update({
      status: req.body.status,
      ...(req.body.status === 'DELIVERED' && { actualDeliveryTime: new Date() })
    });

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    logger.error(`Error updating order status with id ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// Update order details
exports.update = async (req, res) => {
  try {
    const db = await getDB();
    const Order = db.Order;
    const OrderItem = db.OrderItem;

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Start transaction
    const t = await db.sequelize.transaction();

    try {
      // Update order
      const updatedOrder = await order.update(req.body, { transaction: t });

      // If there are updated items, handle them
      if (req.body.items && req.body.items.length > 0) {
        // Delete existing items
        await OrderItem.destroy({
          where: { orderId: order.id },
          transaction: t
        });

        // Create new items
        await Promise.all(
          req.body.items.map(item => 
            OrderItem.create({
              orderId: order.id,
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice,
              notes: item.notes
            }, { transaction: t })
          )
        );
      }

      // Commit transaction
      await t.commit();

      // Fetch updated order with items
      const result = await Order.findByPk(order.id, {
        include: [{ model: OrderItem, as: 'items' }]
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      // Rollback transaction on error
      await t.rollback();
      throw error;
    }
  } catch (error) {
    logger.error(`Error updating order with id ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    });
  }
};

// Delete an order
exports.delete = async (req, res) => {
  try {
    const db = await getDB();
    const Order = db.Order;
    const OrderItem = db.OrderItem;

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Start transaction
    const t = await db.sequelize.transaction();

    try {
      // Delete order items
      await OrderItem.destroy({
        where: { orderId: order.id },
        transaction: t
      });

      // Delete order
      await order.destroy({ transaction: t });

      // Commit transaction
      await t.commit();

      res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
      });
    } catch (error) {
      // Rollback transaction on error
      await t.rollback();
      throw error;
    }
  } catch (error) {
    logger.error(`Error deleting order with id ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message
    });
  }
}; 