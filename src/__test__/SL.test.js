const request = require('supertest');
const { app } = require('../server');
const { sequelize } = require('../auth/models/index');

// Dummy server and database setup
let server;
beforeAll(async () => {
  // Start the server
  server = app.listen(3000);

  // Connect to the dummy database
  await sequelize.sync({ force: true }); // Drops and recreates all tables

  // Additional setup for the dummy database (e.g., seeding data)
  // ...
});

afterAll(async () => {
  // Close the server
  server.close();

  // Disconnect from the dummy database
  await sequelize.close();
});
describe('Signup and Login Routes', () => {
    let createdUser; // Variable to store the created user
  
    it('should create a new user on POST /signup', async () => {
      const response = await request(app)
        .post('/signup')
        .send({ username: 'testuser', password: 'testpassword' });
  
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('username', 'testuser');
  
      // Store the created user for later use in login test
      createdUser = response.body;
    });
  
    it('should login with valid credentials on POST /login', async () => {
        const response = await request(app)
          .post('/login')
          .auth('testuser', 'testpassword') // Use the test username and password
          .send();
      
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', `Login successful testuser`);
      });
  });