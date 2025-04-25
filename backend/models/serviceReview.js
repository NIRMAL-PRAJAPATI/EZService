const sequelize6 = require('../db');
const { Sequelize, DataTypes } = require('sequelize');

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

module.exports = ServiceReview;