module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define('order', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    totalAmount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM(
        'CREATED',
        'PENDING',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED'
      ),
      defaultValue: 'CREATED'
    },
    paymentMethod: {
      type: Sequelize.ENUM('CREDIT_CARD', 'PAYPAL', 'CASH'),
      defaultValue: 'CREDIT_CARD'
    },
    paymentStatus: {
      type: Sequelize.ENUM('PENDING', 'PAID', 'FAILED'),
      defaultValue: 'PENDING'
    },
    shippingAddress: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    deliveryNotes: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    estimatedDeliveryTime: {
      type: Sequelize.DATE,
      allowNull: true
    },
    actualDeliveryTime: {
      type: Sequelize.DATE,
      allowNull: true
    },
    driverId: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });

  return Order;
}; 