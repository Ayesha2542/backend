const mongoose = require('mongoose');
const multer = require('multer');
const express = require("express");
const app = express();
const cors = require('cors');
const root=require('../rootPath')
app.use(cors());
app.use(express.static(root+'/public/assets/images'));
app.use('/customerProfiles',express.static('customerProfiles'));
app.use('/Categories',express.static('Categories'));
module.exports = {
    mongoose:mongoose,
    multer:multer,
    app:app
}