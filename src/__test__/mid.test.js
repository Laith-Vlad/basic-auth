require('dotenv').config(); // Load environment variables
const authMiddleware = require('../auth/middleware/basic');
const Users = require('../auth/models/users.model');

describe('Authentication Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=' // base64-encoded "username:password"
      }
    };
    res = {};
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the next function with user data if authentication is successful', async () => {
    const mockedUser = { id: 1, username: 'username' };

    // Mock the basicChecker function
    Users.basicChecker = jest.fn().mockResolvedValue({ user: mockedUser });

    await authMiddleware(req, res, next);

    expect(Users.basicChecker).toHaveBeenCalledWith('username', 'password');
    expect(req.user).toEqual({ user: mockedUser });
    expect(next).toHaveBeenCalled();
  });

  it('should call the next function with user data if authentication is successful', async () => {
    const mockedUser = { id: 1, username: 'username' };
  
    // Mock the basicChecker function
    Users.basicChecker = jest.fn().mockResolvedValue({ user: mockedUser });
  
    await authMiddleware(req, res, next);
  
    expect(Users.basicChecker).toHaveBeenCalledWith('username', 'password');
    expect(req.user).toEqual({ user: mockedUser });
    expect(next).toHaveBeenCalled();
  });
  it('should call the next function with an error if the authorization header is missing', async () => {
    req.headers.authorization = undefined;

    await authMiddleware(req, res, next);

    expect(Users.basicChecker).not.toHaveBeenCalled();
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledWith('Error!');
  });
});