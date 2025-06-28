const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8085;

// Log the port we're going to use
console.log(`Configuring server to use port: ${PORT}`);

// Enhanced logging function
const logRequest = (req, res, next) => {
  const start = Date.now();
  const url = req.originalUrl || req.url;
  const method = req.method;
  
  console.log(`[${new Date().toISOString()}] ${method} ${url} - Request received`);
  if (req.body && Object.keys(req.body).length) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }

  // Override res.end to log responses
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${method} ${url} - Response sent (${res.statusCode}) in ${responseTime}ms`);
    return originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    return callback(null, origin);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));
app.use(logRequest);

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
  const user = users.find(u => u.username === username || u.email === username);
  
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
  console.log('Register request received with body:', JSON.stringify(req.body));
  
  try {
    const { username, email, password, firstName, lastName, phoneNumber } = req.body;
    
    if (!username || !email || !password) {
      console.log('Registration failed - missing required fields');
      return res.status(400).json({
        message: 'Username, email, and password are required'
      });
    }
    
    // Check if user already exists
    if (users.some(u => u.username === username)) {
      console.log('Registration failed - username exists:', username);
      return res.status(409).json({
        message: 'Username already exists. Please choose a different username.'
      });
    }
    
    if (users.some(u => u.email === email)) {
      console.log('Registration failed - email exists:', email);
      return res.status(409).json({
        message: 'Email already in use. Please use a different email address.'
      });
    }
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      username,
      email,
      firstName: firstName || username.split(' ')[0],
      lastName: lastName || username.split(' ').slice(1).join(' ') || username,
      phoneNumber: phoneNumber || '',
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
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Internal server error during registration',
      error: error.message
    });
  }
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'auth-service',
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Auth service server running on port ${PORT}`);
}); 