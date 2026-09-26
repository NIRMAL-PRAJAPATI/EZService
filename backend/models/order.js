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
  status: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'),
  // Progress of a confirmed visit: null (not started) -> ON_THE_WAY -> ARRIVED
  trip_status: DataTypes.STRING,
  trip_updated: DataTypes.DATE,
  // 4-digit code shown only to the customer; the provider must enter it on arrival
  trip_pin: DataTypes.STRING,
  // Exact service location (customer's live location for instant orders)
  lat: DataTypes.DOUBLE,
  lng: DataTypes.DOUBLE,
  // How the customer paid when the service was completed: UPI | CASH | NET_BANKING
  payment_mode: DataTypes.STRING,
  // PENDING (provider asked for payment) -> CUSTOMER_PAID (customer says it's sent) -> PAID (provider confirmed)
  payment_status: DataTypes.STRING,
  // UPI / bank transaction reference (UTR) given by the customer
  payment_ref: DataTypes.STRING,
  paid_at: DataTypes.DATE
}, {
  tableName: 'order',
  timestamps: false,
  // Never send the arrival code in normal order responses (providers must not see it)
  defaultScope: { attributes: { exclude: ['trip_pin'] } },
  hooks: {
    beforeCreate: (order, options) => {
      const time = new Date().getTime();
      order.order_id = `${time}-${order.customer_id}-${order.service_id}-${order.provider_id}`;
    },
  }
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
