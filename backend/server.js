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

const whitelist = ['http://localhost:3000', 'http://localhost:5173'];
// const credentials = (req, res, next) => {
//   const origin = req.headers.origin;
//   if (whitelist.indexOf(origin) !== -1) {
//     res.header('Access-Control-Allow-Credentials', 'true');
//   }
//   next();
// };
// app.use(credentials);

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

app.use(cors({
  origin: 'https://cfg-chi.vercel.app',
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'

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
