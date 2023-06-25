'use strict';
const { sequelize, DataTypes } = require('./index'); // Replace '../database/connection' with the path to your sequelize configuration
const bcrypt = require('bcrypt');
const users = sequelize.define('users', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
users.basicChecker = async function(username, password) {
    const user = await users.findOne({ where: { username } });
  
    if (!user) {
        throw {
          message: 'User does not exist',
          error: new Error('User does not exist')
        };
      }
  
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      return {
        user
      };
    } else {
      throw {
        message: 'Invalid password',
        error: new Error('Invalid password')
      };
    }
  };

module.exports = users;