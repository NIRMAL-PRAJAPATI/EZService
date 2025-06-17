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
      if (!rawValue) return null;
      
      // Normalize path to use forward slashes
      const normalizedPath = rawValue.replace(/\\/g, '/');
      
      // Only add prefix if it doesn't already have it
      if (!normalizedPath.startsWith(process.env.IMAGE_SOURCE)) {
        return `${process.env.IMAGE_SOURCE}${normalizedPath}`;
      }
      return normalizedPath;
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
      
      // Normalize paths to use forward slashes and add prefix if needed
      return rawValue.map(img => {
        if (!img) return '';
        
        // Replace backslashes with forward slashes
        const normalizedPath = img.replace(/\\/g, '/');
        
        // Add prefix if it doesn't already have it
        if (!normalizedPath.startsWith(process.env.IMAGE_SOURCE)) {
          return `${process.env.IMAGE_SOURCE}${normalizedPath}`;
        }
        return normalizedPath;
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
