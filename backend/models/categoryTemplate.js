const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

const CategoryTemplate = sequelize.define('CategoryTemplate', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  created: DataTypes.DATE,
  categories: DataTypes.ARRAY(DataTypes.STRING)
}, {
  tableName: 'category_template',
  timestamps: false
});

module.exports = CategoryTemplate;
