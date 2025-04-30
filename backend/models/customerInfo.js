const bcrypt = require('bcrypt');
const sequelize2 = require('../db');
const { Sequelize, DataTypes } = require('sequelize');
const CustomerComplaint = require("../models/customerComplaint")
const CustomerInfo = sequelize2.define('CustomerInfo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  mobile: DataTypes.STRING,
  password: DataTypes.STRING,
  created: DataTypes.DATE,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  country: DataTypes.STRING,
  pincode: DataTypes.INTEGER
}, {
  tableName: 'customer_info',
  timestamps: false,
  hooks: {
    beforeCreate: async (customer) => {
      if (customer.password) {
        const salt = await bcrypt.genSalt(10);
        customer.password = await bcrypt.hash(customer.password, salt);
      }
    },
    beforeUpdate: async (customer) => {
      if (customer.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        customer.password = await bcrypt.hash(customer.password, salt);
      }
    }
  }
});

CustomerInfo.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

CustomerInfo.hasMany(CustomerComplaint, {
  foreignKey: 'customer_id',
  sourceKey: 'id'
});

CustomerComplaint.belongsTo(CustomerInfo, {
  foreignKey: 'customer_id',
  targetKey: 'id'
});

module.exports = CustomerInfo;