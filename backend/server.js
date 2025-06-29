const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRouter = require('./routes/api/auth');
const userRouter = require('./routes/api/user');
const adminRouter = require('./routes/api/admin');
const educatorRouter = require('./routes/api/educator');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Atlas connection (removed deprecated options)
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

const whitelist = ['http://localhost:3000', 'http://localhost:5173','https://cfg-chi.vercel.app'];
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
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/educator', educatorRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});