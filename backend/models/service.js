const sequelize4 = require('../db');
const { Sequelize, DataTypes } = require('sequelize');

const Service = sequelize4.define('Service', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  provider_id: {
    type: DataTypes.INTEGER,
    references: { model: 'provider_info', key: 'id' }
  },
  name: DataTypes.STRING,
  cover_image: DataTypes.TEXT,
  visiting_charge: DataTypes.BIGINT,
  instant_visiting_charge: DataTypes.BIGINT,
  description: DataTypes.TEXT,
  locations: DataTypes.ARRAY(DataTypes.STRING),
  experience: DataTypes.INTEGER,
  specifications: DataTypes.ARRAY(DataTypes.STRING),
  working_images: DataTypes.ARRAY(DataTypes.STRING),
  badge_status: DataTypes.BOOLEAN,
  created: DataTypes.DATE,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  country: DataTypes.STRING,
  category_id: {
    type: DataTypes.INTEGER,
    references: { model: 'service_category', key: 'id' }
  },
  service_type: DataTypes.ENUM('HOME', 'INSTANT')
}, {
  tableName: 'service',
  timestamps: false
});

module.exports = Service;
