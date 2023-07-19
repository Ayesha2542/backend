const mongoose = require('mongoose');
const multer = require('multer');
const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());

module.exports = {
    mongoose:mongoose,
    multer:multer,
    app:app
}