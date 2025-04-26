const sequelize4 = require('../db');
const { DataTypes } = require('sequelize');

const ServiceCategory = sequelize4.define('ServiceCategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  created: DataTypes.DATE,
  cover_image: DataTypes.TEXT
}, {
  tableName: 'service_category',
  timestamps: false
});

module.exports = ServiceCategory;
