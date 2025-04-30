const sequelize4 = require('../db');
const { Sequelize, DataTypes } = require('sequelize');
const CustomerInfo = require("./customerInfo")
const ProviderInfo = require("./providerInfo")
const Service = require("./service")

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

// One-to-Many: Customer -> Orders
CustomerInfo.hasMany(Order, {
  foreignKey: 'customer_id',
  sourceKey: 'id'
});
Order.belongsTo(CustomerInfo, {
  foreignKey: 'customer_id',
  targetKey: 'id'
});

// One-to-Many: Service -> Orders
Service.hasMany(Order, {
  foreignKey: 'service_id',
  sourceKey: 'id'
});
Order.belongsTo(Service, {
  foreignKey: 'service_id',
  targetKey: 'id'
});

// One-to-Many: Provider -> Orders
ProviderInfo.hasMany(Order, {
  foreignKey: 'provider_id',
  sourceKey: 'id'
});
Order.belongsTo(ProviderInfo, {
  foreignKey: 'provider_id',
  targetKey: 'id'
});

module.exports = Order;
