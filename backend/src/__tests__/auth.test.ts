import { register } from '../controllers/authController';
import User from '../models/User';
import { Response } from 'express';
import { AuthRequest } from '../types';

jest.mock('../models/User');

describe('Auth Controller - Register', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockRequest = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      },
    } as any;
    mockResponse = {
      status: statusMock,
      cookie: jest.fn(),
    };
  });

  it('should register a new user successfully', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.create as jest.Mock).mockResolvedValue({
      _id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      save: jest.fn(),
    });

    await register(mockRequest as AuthRequest, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Test User',
      email: 'test@example.com',
    }));
  });

  it('should return 400 if user already exists', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ email: 'test@example.com' });

    await register(mockRequest as AuthRequest, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'User already exists' });
  });
});
