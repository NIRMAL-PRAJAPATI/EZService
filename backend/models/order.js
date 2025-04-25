const sequelize4 = require('../db');
const { Sequelize, DataTypes } = require('sequelize');

const Order = sequelize4.define('Order', {
  order_id: { type: DataTypes.STRING, primaryKey: true },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'customer_info', key: 'id' }
  },
  service_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'service', key: 'id' }
  },
  provider_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'provider_info', key: 'id' }
  },
  location: DataTypes.TEXT,
  date: DataTypes.TEXT,
  issue: DataTypes.TEXT,
  created: DataTypes.DATE,
  estimated_charge: DataTypes.BIGINT,
  updated: DataTypes.DATE,
  status: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')
}, {
  tableName: 'order',
  timestamps: false
});

module.exports = Order;
