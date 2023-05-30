const Admin = require('../model/adminSchema')
const User = require('../model/userSchema')
const Userdocument = require('../model/userDocumentSchema');

require('dotenv').config();

// admin Login

exports.adminLogin = async (req, res) => {
    try {
        const {admin_id,password} = req.body;
        if(!admin_id || !password ){
            return res.status(422).json({message:"Please fill credentials to login"})
        }
            const adminLogin = await Admin.findOne({admin_id:admin_id})
            
        //console.log(adminLogin);
        if(!adminLogin){
            res.status(404).json({message:"Invalid Credentials"})
        }else{
            if(password === adminLogin.password){
                //console.log('login');
                const token = await adminLogin.generateAuthToken();

                console.log(token);
                res.cookie("jwtoken",token,{
                    expires:new Date(Date.now()+ 2880000000),
                    httpOnly:true
                });
               
                res.status(201).json({message:"Admin Login Successfully",token:token});
            }else{
               return res.status(404).json({error:"Invalid Credentials"})
            }
        }

    } catch (error) {
        console.log(error);
    }
}

// admin logout
exports.adminLogout = (req , res) =>{
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).json({message:"Logged out"});
}


// fetchUserDetails
exports.fetchUserDetails = (req,res) =>{
    User.find((err,result)=>{
      if(err){
          console.log(err);
      }else{
          res.status(200).json({result});
      }
    })
      
  }

// fetchParticularUserDetails
exports.fetchParticularUserDetails = (req,res) =>{
    const _id = req.body;
        User.findById(_id)
        .then(result =>{
            res.status(200).json({message:"Details Fetched",
            result
        })
        })
        .catch(err =>{
            res.status(500).json({error:err})
        })
    
    
}

// verifyUser
exports.verifyUser = async (req,res) =>{
    const {status,id} = req.body;
    let result = await User.updateOne(
        {_id:id},{
            $set:{status:status}
            
        }
    );
    if(result.modifiedCount > 0){
        return res.status(200).json({
            message:"Verified Successfully"
        })
    }else{
        return res.status(404).json({
            message:"Something Went wrong"
        })
    }
   
}

// fetchUserDocumentAdmin
exports.fetchUserDocumentAdmin = async (req,res) =>{
    const {userid} = req.body;
   await Userdocument.find({userid})
    .then(result =>{
        res.status(200).json({message:"Details Fetched",
        result
    })
    })
    .catch(err =>{
        res.status(500).json({error:err})
    }) 
}