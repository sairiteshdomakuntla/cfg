const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/api/auth'); // No .js needed in CommonJS
const userRouter = require('./routes/api/user'); // No .js needed in CommonJS

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

const whitelist = ['http://localhost:3000', 'http://localhost:5173'];
const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (whitelist.indexOf(origin) !== -1) {
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
};
app.use(credentials);

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Basic route
app.get('/', (req, res) => {
  res.send('Express server is running!');
});

// API Routes
app.use('/auth', authRouter);
app.use('/user', userRouter); // No .js needed in CommonJS

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
