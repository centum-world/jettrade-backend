const mongoose = require('mongoose');
const express = require('express');
//const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
require('./database/conn');
const path = require('path');


const adminLogin = require('./routes/adminLogin');
const adminLogout = require('./routes/adminLogout');
const userRegistration = require('./routes/userRegistration');
const userLogin = require('./routes/users/userLogin');
const userFetchDeatils = require('./routes/users/userFetchDetails');
const changePassword = require('./routes/users/changePassword');
const forgetPassword = require('./routes/users/forgetPassword');
const verifyOtp = require('./routes/users/verifyOtp');
const resetPassword = require('./routes/users/resetPassword');
const profileVerification = require('./routes/users/profileVerification');
const profilePhotoUpload = require('./routes/users/profilePhotoUpload')
const fetchUserDetailsUserside = require('./routes/users/fetch-user-details-userside');
const verifyUser = require('./routes/verify-user');
const fetchUserDetails = require('./routes/fetch-user-details');
const fetchParticularUserDetails = require('./routes/fetch-particular-user-details');
const fetchProfilePhotoUser = require('./routes/users/fetch-profile-photo-user');
const fetchUserDocumentUser = require('./routes/users/fetch-user-document-user');
const fetchUserDocumentAdmin = require('./routes/fetch-user-document-adminside');





const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
  //app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

app.use('/admin',adminLogin);
app.use('/admin',adminLogout);
app.use('/user',userRegistration);
app.use('/user',userLogin);
app.use('/user',userFetchDeatils);
app.use('/user',changePassword);
app.use('/user',forgetPassword);
app.use('/user',verifyOtp);
app.use('/user',resetPassword);
app.use('/user',profileVerification);
app.use('/user',profilePhotoUpload);
app.use('/user',fetchUserDetailsUserside);
app.use('/admin',verifyUser);
app.use('/admin',fetchUserDetails);
app.use('/admin',fetchParticularUserDetails);
app.use('/user',fetchProfilePhotoUser);
app.use('/user',fetchUserDocumentUser);
app.use('/admin',fetchUserDocumentAdmin)



module.exports = app;