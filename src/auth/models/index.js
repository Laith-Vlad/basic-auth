'use strict';

require('dotenv').config(); // Add dotenv configuration

const { Sequelize, DataTypes } = require('sequelize');
const userSchema = require('./users.model.js');

const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite::memory' : process.env.DB_URL;

const DATABASE_CONFIG = process.env.NODE_ENV === 'production' ? {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  }
} : {};

const sequelize = new Sequelize(DATABASE_URL, DATABASE_CONFIG);

module.exports = { sequelize, DataTypes };
