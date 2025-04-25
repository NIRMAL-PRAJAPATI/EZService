const { Sequelize, DataTypes } = require('sequelize');
const sequelize6 = require('../db');

const ProviderBank = sequelize6.define('ProviderBank', {
  provider_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: { model: 'provider_info', key: 'id' }
  },
  holder_name: DataTypes.STRING,
  account_number: DataTypes.BIGINT,
  account_type: DataTypes.STRING,
  ifsc_code: DataTypes.BIGINT,
  bank_name: DataTypes.STRING,
  branch: DataTypes.TEXT
}, {
  tableName: 'provider_bank',
  timestamps: false
});

module.exports = ProviderBank;
