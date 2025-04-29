const sequelize4 = require('../db');
const { DataTypes } = require('sequelize');
const ServiceCategory = require('../models/serviceCategory');

const Service = sequelize4.define('Service', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  provider_id: {
    type: DataTypes.INTEGER,
    references: { model: 'provider_info', key: 'id' } // ✅ correct way (string table name)
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
    references: { model: 'service_category', key: 'id' } // ✅ correct (table name string)
  },
  service_type: DataTypes.ENUM('HOME', 'INSTANT')
}, {
  tableName: 'service',
  timestamps: false
});

Service.belongsTo(ServiceCategory, { foreignKey: 'category_id' });
ServiceCategory.hasMany(Service, { foreignKey: 'category_id' });


module.exports = Service;
