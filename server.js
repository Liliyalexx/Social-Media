const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const mongoose = require("mongoose");
const User = require('./models/user');
const Post = require('./models/post');

const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.get('/', (req, res) => {
    res.send('Welcome to the Visionary App!');
  });
  
app.listen(3000, () => {
  console.log(`Listening on port ${PORT}`);
});
