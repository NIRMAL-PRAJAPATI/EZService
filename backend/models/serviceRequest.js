const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const CustomerInfo = require('./customerInfo');
const ServiceCategory = require('./serviceCategory');

const ServiceRequest = sequelize.define('ServiceRequest', {
  id: { 
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true 
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'customer_info', key: 'id' }
  },
  service_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'service_category', key: 'id' }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'PENDING'
  },
  created: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'service_request',
  timestamps: false
});

// Relationships
CustomerInfo.hasMany(ServiceRequest, {
  foreignKey: 'customer_id',
  sourceKey: 'id'
});

ServiceRequest.belongsTo(CustomerInfo, {
  foreignKey: 'customer_id',
  targetKey: 'id'
});

ServiceCategory.hasMany(ServiceRequest, {
  foreignKey: 'service_type_id',
  sourceKey: 'id'
});

ServiceRequest.belongsTo(ServiceCategory, {
  foreignKey: 'service_type_id',
  targetKey: 'id',
  as: 'serviceType'
});

module.exports = ServiceRequest;