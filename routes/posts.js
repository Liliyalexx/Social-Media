var express = require('express');
const passport = require('passport');
var router = express.Router();
const userModel = require("./user");
const postModel = require("./posts");
const upload = require("./file_Uploader");
const path = require('path');
const fs = require('fs').promises;