const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const Post = require("./models/posts");
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const upload = require("./utils/fileUploader");
const path = require('path');
// Initialize routers
const indexRouter = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
  // Passport configuration
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.get("/", (req, res) => {
  res.send("Welcome to the Visionary App!");
});
// Set the view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.listen(3000, () => {
  console.log(`Listening on port ${PORT}`);
});
