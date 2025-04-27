// src/mocks/handlers.ts
import { rest } from 'msw';
import { handlers as moduleHandlers } from './handlers/index';

export const handlers = [
  // Mock the login endpoint
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: '1',
          username: 'user1',
          email: 'user1@example.com',
          firstName: 'John',
          lastName: 'Doe',
          roles: ['USER']
        }
      })
    );
  }),

  // Mock the registration endpoint
  rest.post('/api/auth/register', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: '1',
          username: 'user1',
          email: 'user1@example.com',
          firstName: 'John',
          lastName: 'Doe',
          roles: ['USER']
        }
      })
    );
  }),

  // Mock user profile endpoint
  rest.get('/api/users/profile', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: '1',
        username: 'user1',
        email: 'user1@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567890',
        roles: ['USER']
      })
    );
  }),
  
  ...moduleHandlers
]; 