const sequelize5 = require('../db');
const { Sequelize, DataTypes } = require('sequelize');

const CustomerComplaint = sequelize5.define('CustomerComplaint', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'customer_info', key: 'id' }
  },
  subject: DataTypes.TEXT,
  issue: DataTypes.TEXT,
  provider_id: {
    type: DataTypes.INTEGER,
    references: { model: 'provider_info', key: 'id' }
  },
  service_id: {
    type: DataTypes.INTEGER,
    references: { model: 'service', key: 'id' }
  },
  issue_id: DataTypes.INTEGER,
  created: DataTypes.DATE,
  status: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED')
}, {
  tableName: 'customer_complaint',
  timestamps: false
});

module.exports = CustomerComplaint;