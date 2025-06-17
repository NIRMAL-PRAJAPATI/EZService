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
  cover_image: {
    type: DataTypes.TEXT, 
    get(){
      const rawValue = this.getDataValue('cover_image');
      // Only add prefix if it doesn't already have it
      if (rawValue && !rawValue.startsWith(process.env.IMAGE_SOURCE)) {
        return `${process.env.IMAGE_SOURCE}${rawValue}`;
      }
      return rawValue;
    }
  },
  visiting_charge: DataTypes.BIGINT,
  instant_visiting_charge: DataTypes.BIGINT,
  description: DataTypes.TEXT,
  locations: DataTypes.ARRAY(DataTypes.STRING),
  experience: DataTypes.INTEGER,
  specifications: DataTypes.ARRAY(DataTypes.STRING),
  working_images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    get() {
      const rawValue = this.getDataValue('working_images');
      if (!rawValue) return [];
      
      // Only add prefix to paths that don't already have it
      return rawValue.map(img => {
        if (img && !img.startsWith(process.env.IMAGE_SOURCE)) {
          return `${process.env.IMAGE_SOURCE}${img}`;
        }
        return img;
      });
    }
  },
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

Service.belongsTo(ServiceCategory, { foreignKey: 'category_id', as: 'category' });
ServiceCategory.hasMany(Service, { foreignKey: 'category_id' });


module.exports = Service;
