const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.SERVER_PORT || 8081;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Mock user database
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    phoneNumber: '+1234567890',
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    profileImageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    creditScore: 95,
    verificationStatus: 2
  }
];

// Mock tokens
const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Auth routes
app.post('/api/v1/auth/login', (req, res) => {
  console.log('Login request received:', req.body);
  
  const { username, password } = req.body;
  
  // Find user (in a real app, we would check password hash)
  const user = users.find(u => u.username === username);
  
  if (user) {
    // Generate tokens
    const accessToken = generateToken();
    const refreshToken = generateToken();
    
    console.log('Login successful for user:', username);
    
    res.json({
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 86400,
      user: { ...user, password: undefined }
    });
  } else {
    console.log('Login failed - user not found:', username);
    res.status(401).json({
      message: 'Invalid username or password'
    });
  }
});

app.post('/api/v1/auth/register', (req, res) => {
  console.log('Register request received:', req.body);
  
  const { username, email, password, firstName, lastName, phoneNumber } = req.body;
  
  // Check if user already exists
  if (users.some(u => u.username === username)) {
    console.log('Registration failed - username exists:', username);
    res.status(400).json({
      message: 'Username already exists'
    });
    return;
  }
  
  if (users.some(u => u.email === email)) {
    console.log('Registration failed - email exists:', email);
    res.status(400).json({
      message: 'Email already exists'
    });
    return;
  }
  
  // Create new user
  const newUser = {
    id: users.length + 1,
    username,
    email,
    firstName,
    lastName,
    phoneNumber,
    roles: ['ROLE_USER'],
    profileImageUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    creditScore: 85,
    verificationStatus: 0
  };
  
  // Add to mock database
  users.push(newUser);
  
  // Generate tokens
  const accessToken = generateToken();
  const refreshToken = generateToken();
  
  console.log('Registration successful for user:', username);
  
  res.status(201).json({
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: 86400,
    user: { ...newUser, password: undefined }
  });
});

app.post('/api/v1/auth/refresh-token', (req, res) => {
  console.log('Token refresh request received:', req.body);
  
  const { refreshToken } = req.body;
  
  // Always succeed for mock service
  const accessToken = generateToken();
  const newRefreshToken = generateToken();
  
  res.json({
    accessToken,
    refreshToken: newRefreshToken,
    tokenType: 'Bearer',
    expiresIn: 86400
  });
});

app.get('/api/v1/auth/me', (req, res) => {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      message: 'Unauthorized'
    });
    return;
  }
  
  // In a real app, we would validate the token
  // For our mock, just return the admin user
  res.json(users[0]);
});

// Start server
app.listen(PORT, () => {
  console.log(`Auth service mock server running on port ${PORT}`);
}); 