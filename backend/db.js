const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false, // Disable logging; default: console.log
});

sequelize.sync({force: false}).then(()=>{
  console.log("Database synced successfully");
}).catch((err)=>{
  console.error("Error syncing database:", err);
});
module.exports = sequelize;


// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// const sequelize = new Sequelize('postgres://postgres:root@43.204.112.76:5432/ezservice', {
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: false
//   },
//   logging: false
// });

// sequelize.sync({force: false}).then(()=>{
//   console.log("Database synced successfully");
// }).catch((err)=>{
//   console.error("Error syncing database:", err);
// });
// module.exports = sequelize;