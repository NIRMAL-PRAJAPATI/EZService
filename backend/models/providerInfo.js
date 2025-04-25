const bcrypt2 = require('bcryptjs');
const sequelize3 = require('../db');
const { Sequelize, DataTypes } = require('sequelize');

const ProviderInfo = sequelize3.define('ProviderInfo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  mobile: DataTypes.STRING,
  password: DataTypes.STRING,
  address: DataTypes.TEXT,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  country: DataTypes.STRING,
  created: DataTypes.DATE
}, {
  tableName: 'provider_info',
  timestamps: false,
  hooks: {
    beforeCreate: async (provider) => {
      if (provider.password) {
        const salt = await bcrypt2.genSalt(10);
        provider.password = await bcrypt2.hash(provider.password, salt);
      }
    },
    beforeUpdate: async (provider) => {
      if (provider.changed('password')) {
        const salt = await bcrypt2.genSalt(10);
        provider.password = await bcrypt2.hash(provider.password, salt);
      }
    }
  }
});

ProviderInfo.prototype.validPassword = async function (password) {
  return await bcrypt2.compare(password, this.password);
};

module.exports = ProviderInfo;