'use strict';
const express = require('express');
const notFoundHandler = require('../src/errors/404');
const errorHandler = require('../src/errors/500');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(cors());
function start (port) {
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
}
const basicAuth = require('../src/auth/middleware/basic');
const users = require('../src/auth/models/users.model');
const bcrypt = require('bcrypt');
app.use(express.json());
app.get('/', homeHandler);
app.post('/signup', signup);
app.post('/login', basicAuth, handleLogin);
//not fond handler
app.use(notFoundHandler);

// 500 Internal Server Error handler
app.use(errorHandler);

function homeHandler(req, res)
{
    
    res.send('welcome home');
}

async function signup(req, res) {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = await users.create({
      username,
      password: hashedPassword
    });
    res.status(201).json(newUser);
  }
  async function handleLogin(req, res, next) {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      // Authorization header missing or not using Basic authentication
      return res.status(401).json({ message: 'Invalid authorization header' });
    }
  
    const credentials = authHeader.slice(6); // Remove 'Basic ' from the beginning
    const decodedCredentials = Buffer.from(credentials, 'base64').toString();
    const [username, password] = decodedCredentials.split(':');
  
    try {
      // Find the user in the database by username
      const user = await users.findOne({ where: { username } });
  
      // If the user is found, compare the password
      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
          // Password is valid, return success response
          res.status(201).json({ message: `Login successful ${user.username}` });
        } else {
          // Invalid password
          res.status(401).json({ message: 'Invalid username or password' });
        }
      } else {
        // User not found
        res.status(401).json({ message: 'Invalid username or password' });
      }
    } catch (error) {
      // Error occurred during login process
      next(error);
    }
  }

module.exports = { app, start }
