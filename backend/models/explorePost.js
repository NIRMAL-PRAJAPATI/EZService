const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const CustomerInfo = require('./customerInfo');
const ProviderInfo = require('./providerInfo');

const ExplorePost = sequelize.define('ExplorePost', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'customer_info', key: 'id' }
  },
  provider_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'provider_info', key: 'id' }
  },
  type: { type: DataTypes.ENUM('comment', 'complaint'), allowNull: false },
  subject: DataTypes.STRING,
  message: DataTypes.TEXT,
  hashtags: DataTypes.ARRAY(DataTypes.STRING),
  rating: DataTypes.INTEGER,
  image: {
    type: DataTypes.TEXT,
    get() {
      const rawValue = this.getDataValue('image');
      if (!rawValue) return null;

      const normalizedPath = rawValue.replace(/\\/g, '/');
      if (!normalizedPath.startsWith(process.env.IMAGE_SOURCE)) {
        return `${process.env.IMAGE_SOURCE}${normalizedPath}`;
      }
      return normalizedPath;
    }
  },
  created: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'explore_post',
  timestamps: false
});

ExplorePost.belongsTo(CustomerInfo, { foreignKey: 'customer_id' });
ExplorePost.belongsTo(ProviderInfo, { foreignKey: 'provider_id' });

module.exports = ExplorePost;
