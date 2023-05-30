const User = require('../model/userSchema')
const multer = require('multer')
const sharp = require('sharp');
const bcrypt = require('bcrypt');
const forgetPasswordSms = require('../utils/forget-password-otp');
require('dotenv').config();
const ProfilePhoto = require('../model/profilePhotoSchema');
const Userdocument = require('../model/userDocumentSchema');
//const profilePhoto = require('../model/profilePhotoSchema');


//userRegistartion
exports.userRegistration = async (req, res) => {


    const { fname, lname, email, phone, address, gender, dob, aadhar, pan, reffered_id } = req.body;

    if (!req.files || !req.files['aadhar_upload'] || !req.files['pan_upload'][0]) {

        return res.status(422).json({ message: "Please Fill all Details!" })

    }
    const aadhar_upload = req.files['aadhar_upload'][0].filename;
    const pan_upload = req.files['pan_upload'][0].filename;
    //const pan_upload = req.files.pan_upload[0].filename;

    if (!fname || !lname || !phone || !address || !gender || !dob || !aadhar || !pan || !reffered_id) {

        return res.status(422).json({ message: "Please Fill all Details!" })
    }
    else {

        try {
            const userid = fname + Math.floor(Math.random() * 100000 + 1);
            const refferal_id = userid + Math.floor(Math.random() * 100000 + 1);
            console.log(refferal_id);
            function makepassword(length) {
                let result = '';
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%&@#';
                const charactersLength = characters.length;
                let counter = 0;
                while (counter < length) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                    counter += 1;
                }
                return result;
            }

            const password = makepassword(8)
            console.log(password, '49');

            const userExist = await User.findOne({ userid: userid });
            if (userExist) {
                return res.status(200).json({ message: 'Something went wrong try again!' })
            }

            const user = new User({ fname, lname, email, phone, address, gender, dob, aadhar, pan, refferal_id, reffered_id, aadhar_upload, pan_upload, userid, password });
            await user.save();
            res.status(201).json({ message: "User registered successfully" });


        }

        catch (error) {
            console.log(error);
        }
    }

}

// userLogin

exports.userLogin = async (req, res) => {

    const { userid, password } = req.body;
    if (!userid || !password) {
        return res.status(422).json({ message: "Please fill all details" });
    }
    const userLogin = await User.findOne({ userid: userid });
    if (!userLogin) {
        return res.status(404).json({ message: "Invalid Credential!" });

    }
    try {
        const isMatch = await bcrypt.compare(password, userLogin.password);
        const token = await userLogin.generateAuthToken();
        console.log(token);
        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 28800000000),
            httpOnly: true
        });
        if (!isMatch) {
            return res.status(404).json({ message: "Invalid Credential!" })
        } else {
            return res.status(200).json({
                message: "User Login successfully",
                token: token,
                userLogin
            })
        }
    } catch (error) {
        console.log(error);
    }

}

// userFetchDeatils
exports.userFetchDeatils = async (req, res) => {
    token = req.token;
    verifyToken = req.verifyToken;
    //console.log(token,verifyToken);

    const userFetchDetails = await User.findOne({ token })
    //console.log(userFetchDetails)
    if (userFetchDetails) {
        console.log(userFetchDetails);
        return res.status(200).json({ message: "User Details Fetched" })


    } else {
        return res.status(500).json({ message: "Something went wrong" })
    }


}

// profileVerification
exports.profileVerification = async (req, res) => {

    if (!req.files || !req.files['aadhar_front_side'] || !req.files['aadhar_back_side'] || !req.files['pan_card']) {

        return res.status(422).json({ message: "Please Fill all Details!" })

    }

    //console.log(req.files);
    const { userid } = req.body;
    const aadhar_front_side = req.files.aadhar_front_side[0].location;
    const aadhar_back_side = req.files.aadhar_back_side[0].location;
    const pan_card = req.files.pan_card[0].location;
    console.log(aadhar_back_side, aadhar_front_side, pan_card, userid, '140');


    if (!aadhar_front_side || !aadhar_back_side || !pan_card) {

        return res.status(422).json({ message: "All field required" })
    }
    // console.log(userid);
    // ------------------------------------------
    const user = await Userdocument.find({ userid });

    if (user.length > 0) {
        Userdocument.updateOne({ userid: userid })
            .set({ aadhar_front_side: aadhar_front_side, aadhar_back_side: aadhar_back_side, pan_card: pan_card })
            .then(() => {
                return res.status(201).json({ message: "Document Updated" })
            })
    } else {
        const userdocument = new Userdocument({ userid, aadhar_front_side, aadhar_back_side, pan_card });
        const success = await userdocument.save();

        if (success) {
            return res.send({
                code: 200,
                message: "Uploaded Successfully"
            })
        } else {
            return res.send({
                code: 500,
                message: "Service Error"
            })
        }
    }


    // --------------------------
    // 


    // try {
    //     token = req.token;
    //     const userDetails = await User.findOne({token})
    //     if (userDetails) {
    //         const upload_doc = await userDetails.add_document( doc_type,front_side, back_side);

    //         await userDetails.save();
    //         return res.status(201).json({ message: "Document Uploaded Successfully" })
    //     }
    // } catch (error) {
    //     console.log(error);
    // }
}

// resetPassword
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword, token } = req.body;
    console.log(token);
    console.log(req.token)
    if (!oldPassword || !newPassword) {
        return res.status(422).json({ message: "Fields required" })
    }

    // if (newPassword !== confirmPassword) {
    //     return res.status(422).json({ message: "Password Not Matched" })
    // }


    verifyToken = req.verifyToken;

    const userFetchDetails = await User.findOne({ token })
    console.log(userFetchDetails);
    if (userFetchDetails) {

        const isMatch = await bcrypt.compare(oldPassword, userFetchDetails.password);
        if (isMatch) {
            userFetchDetails.password = req.body.newPassword;
            await userFetchDetails.save();
            return res.status(201).json({ message: "Password successfully Change" })
        } else {
            return res.status(422).json({ message: "Old Password Is Wrong" })
        }
        //console.log(isMatch,'198');

    }

}

// forgetPassword
exports.forgetPassword = async (req, res) => {

    const otp = Math.floor(100000 + Math.random() * 900000);
    const userid = req.body;
    //verifyToken = req.verifyToken;
    console.log(otp, '207');

    const userFetchDetails = await User.findOne(userid)
    console.log(userFetchDetails, '210');

    if (userFetchDetails) {
        let phone = '+91' + userFetchDetails.phone;

        // forgetPasswordSms(phone, {"otp": otp })
        userFetchDetails.otp = otp;
        await userFetchDetails.save();
        return res.status(201).json({ message: "OTP Sent" })
    } else {
        return res.status(404).json({ message: "User not found" })
    }


}

// verifyOtp
exports.verifyOtp = async (req, res) => {
    const { userid } = req.body;
    //verifyToken = req.verifyToken;
    const otp = Number(req.body.otp);
    console.log(typeof (otp));

    const userFetchDetails = await User.findOne({ userid })
    if (userFetchDetails) {

        if (userFetchDetails.otp !== otp) {

            return res.status(400).json({ message: "OTP Invalid" })
        }
        else {
            return res.status(200).json({ message: "OTP matched" })
        }
    }



}

// resetPassword
exports.resetPassword = async (req, res) => {
    const { userid } = req.body;
    const { newPassword, confirmPassword } = req.body;

    console.log(newPassword, confirmPassword);
    if (!newPassword || !confirmPassword) {
        return res.status(422).json({ message: "Fields required" })
    }

    if (newPassword !== confirmPassword) {
        return res.status(422).json({ message: "Password Not Matched" })
    }


    //verifyToken = req.verifyToken;

    const userFetchDetails = await User.findOne({ userid })
    if (userFetchDetails) {
        userFetchDetails.password = req.body.newPassword;
        await userFetchDetails.save();

        return res.status(201).json({ message: "Password Successfully Reset" })
    }

}

// Profile photo Upload
exports.profilePhotoUpload = async (req, res) => {

    //const photo = req.file.filename;
    console.log(req.file, '290');
    if (!req.file) {
        return res.status(400).json({ message: "No File Uploaded" })
    }
    const userid = req.body.userid;
    const imageUrl = req.file.location;

    const result = await ProfilePhoto.find({ userid });
    console.log(result.length);
    if (result.length > 0) {
        ProfilePhoto.updateOne({ userid: userid })
            .set({ imageUrl: imageUrl })
            .then(() => {
                return res.status(201).json({ message: "Profile photo Updated" })
            })
    } else {

        if (!userid || !imageUrl) {
            return res.send({
                code: 400,
                message: "Bad Request"
            })
        }

        const profilePhoto = new ProfilePhoto({ userid: userid, imageUrl: imageUrl })
        const success = await profilePhoto.save()

        if (success) {
            return res.send({
                code: 200,
                message: "Uploaded Successfully"
            })
        } else {
            return res.send({
                code: 500,
                message: "Service Error"
            })
        }
    }




}

exports.fetchUserDetailsUserside = async (req, res) => {
    const _id = req.body;
    User.findById(_id)
        .then(result => {
            res.status(200).json({
                message: "User Details Fetched",
                result
            })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
}

// fetchProfilePhotoUser
exports.fetchProfilePhotoUser = async (req, res) => {
    const { userid } = req.body;
    ProfilePhoto.find({ userid })
        .then(result => {
            res.status(200).json({
                message: "User Details Fetched",
                result
            })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
}

// fetchUserDocumentUser
exports.fetchUserDocumentUser = async(req,res) =>{
    const { userid } = req.body;
     await Userdocument.find({ userid })
        .then(result => {
            res.status(200).json({
                message: "User documents Fetched",
                result
            })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
}