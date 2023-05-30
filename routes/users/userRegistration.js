const express = require('express');
const connection = require('../database/conn')
const router = express.Router();
//const jwt = require('jsonwebtoken');
require('dotenv').config();
const multer = require("multer");

const userController = require('../controllers/userController');

//  set storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/users')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
})
const upload = multer({ storage: storage })
var multipleupload = upload.fields([{ name: 'aadhar_upload' }, { name: 'pan_upload' }]);
router.post('/registration', multipleupload, userController.userRegistration);


module.exports = router;