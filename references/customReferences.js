const mongoose = require('mongoose');
const multer = require('multer');
const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.static('/public/assets/images'));
app.use('/customerProfiles',express.static('customerProfiles'));

module.exports = {
    mongoose:mongoose,
    multer:multer,
    app:app
}