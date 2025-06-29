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
const conversationRouter= require("./routes/api/convo")
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Atlas connection (removed deprecated options)
const uri = "mongodb+srv://sairiteshdomakuntla:rtz0tzNoz7flrOsa@cluster0.keuarrs.mongodb.net/"
mongoose.connect(uri)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

// Single CORS configuration for production
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all origins for now (you can restrict this later)
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  optionsSuccessStatus: 200
}));

// Basic route
app.get('/', (req, res) => {
  res.send('Express server is running!');
});

// API Routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/educator', educatorRouter);
app.use("/api/conversations", conversationRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
