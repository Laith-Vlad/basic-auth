'use strict';

const {Sequelize, DataTypes} = require('sequelize');
const POSTGRS_URL = process.env.DB_URL;

const sequelize = new Sequelize(POSTGRS_URL, {});

module.exports = { sequelize, DataTypes };