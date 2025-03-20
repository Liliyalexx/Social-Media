const dotenv = require("dotenv");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const Post = require("./models/posts");
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const upload = require("./utils/fileUploader");
const path = require('path');
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const MongoStore = require('connect-mongo');

// Initialize routers
const indexRouter = require('./routes/index');
const getWeather = require("./utils/weather");
const stabilityAI = require("./utils/stabilityAI");

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    console.error("MongoDB connection string is missing!");
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // Change from process.env.MONGO_URI
      collectionName: "sessions",
  }),
  cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
  }
}))

app.use(passport.initialize()); 
app.use(passport.session()); 
app.use(flash()); // Enable flash messages
app.use(cors());
app.get('/api/data', (req, res) => {
  res.json({ message: 'This is CORS-enabled for all origins!' });
});

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to pass user and flash messages to views
app.use((req, res, next) => {
  res.locals.user = req.user; // Make user available in views
  res.locals.error = req.flash("error"); // Make flash error messages available in views
  res.locals.success = req.flash("success"); // Make flash success messages available in views
  next();
});

// Set the view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Use routers
app.use('/', indexRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});