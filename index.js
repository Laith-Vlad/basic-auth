const { start, app } = require('./src/server');
const { sequelize } = require('./src/auth/models');

require('dotenv').config();
const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  start(PORT);
});