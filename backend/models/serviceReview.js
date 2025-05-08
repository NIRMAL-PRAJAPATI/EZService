const sequelize6 = require('../db');
const { Sequelize, DataTypes } = require('sequelize');
const CustomerInfo = require("./customerInfo")
const ProviderInfo = require("./providerInfo")
const Service = require("./service")

const ServiceReview = sequelize6.define('ServiceReview', {
  service_id: {
    type: DataTypes.INTEGER,
    references: { model: 'service', key: 'id' },
    allowNull: false
  },
  provider_id: {
    type: DataTypes.INTEGER,
    references: { model: 'provider_info', key: 'id' }
  },
  customer_id: {
    type: DataTypes.INTEGER,
    references: { model: 'customer_info', key: 'id' }
  },
  comment: DataTypes.ARRAY(DataTypes.STRING),
  rating: DataTypes.INTEGER,
  created: DataTypes.DATE,
  customer_satisfation: DataTypes.INTEGER,
  response_time: DataTypes.INTEGER,
  service_reliability: DataTypes.INTEGER
}, {
  tableName: 'service_review',
  timestamps: false
});

Service.hasMany(ServiceReview, {
  foreignKey: 'service_id',
  sourceKey: 'id'
});
ServiceReview.belongsTo(Service, {
  foreignKey: 'service_id',
  targetKey: 'id'
});

// One-to-Many: ProviderInfo -> ServiceReview
ProviderInfo.hasMany(ServiceReview, {
  foreignKey: 'provider_id',
  as: 'serviceReviews',
  sourceKey: 'id'
});
ServiceReview.belongsTo(ProviderInfo, {
  foreignKey: 'provider_id',
  targetKey: 'id'
});

// One-to-Many: CustomerInfo -> ServiceReview
CustomerInfo.hasMany(ServiceReview, {
  foreignKey: 'customer_id',
  sourceKey: 'id'
});
ServiceReview.belongsTo(CustomerInfo, {
  foreignKey: 'customer_id',
  targetKey: 'id'
});

module.exports = ServiceReview;