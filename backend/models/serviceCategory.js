const sequelize5 = require('../db');
const { Sequelize, DataTypes } = require('sequelize');

const ServiceCategory = sequelize5.define('ServiceCategory', {
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