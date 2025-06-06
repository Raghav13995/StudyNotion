// const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const bcrypt=require("bcrypt");
const crypto = require("crypto"); // Added crypto module
console.log("heloo");
const User=require("../models/User");
console.log("user- ",User);
// resetPasswordToken
exports.resetPasswordToken=async(req,res)=>{
    try{
        // get email from req body
        const email=req.body.email;
        console.log("mail: -",email);
        // check user for this email, email validation
        
        // if user not found
        const existingUser = await User.findOne({email:email})
    console.log("user1:-",existingUser);
       if(!existingUser){
           return res.status(400).json({
               success:false,
               message:"Email doesn't exist"
           })
       }
   
        console.log("user:-",existingUser);
        // generate token
        const token=crypto.randomUUID();

        // update user by adding token and expiration time
        const updatedDetails=await User.findOneAndUpdate(
                                        {email:email},
                                        {
                                            token:token,
                                            resetPasswordExpires:Date.now()+5*60*1000,
                                        },
                                        {new:true}
                                    )
        console.log("updatedDetails:-",updatedDetails);
        // create URL:-
        const url=`http://localhost:3000/update-password/${token}`

        // send mail containing URL
        await mailSender(email,"Password    Reset Link",`Password Reset Link: ${url}`);

        // return response
        return res.json({
            success:true,
            message:"Password Reset Link Sent to your email."
        }); 
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
            mess:"Something went wrong while sending mail."

        });
    }
}


// resetPassword 
exports.resetPassword=async(req,res)=>{
    try{
        // data fetch
        // front end ne y tino chije req ki body m dali hai
        const {password,confirmPassword,token}=req.body;
        console.log("token :-",token);
        // validation
        if(!password || !confirmPassword || !token){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields."
            });
        }
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and Confirm Password does not match."
            });
        }
        // find user by token
        console.log("hi1");
        const userDetails=await User.findOne({token:token});
        console.log("hi2",userDetails);

        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"Invalid Token."
            });
        }
        // token time check
        if(userDetails.resetPasswordExpires<Date.now()){
            return res.json({
                success:false,
                message:"Token Expired."
            });
        }
        console.log("hi3");

        // Hash Password:
        const hashedPassword=await bcrypt.hash(password,10);
        console.log("hi5");

        // password update:-
        await User.findOneAndUpdate(
            {token:token},
            {
                password:hashedPassword,
            },
            {new:true}
        )
        
        // return response:
        return res.status(200).json({  
            success:true,
            message:"Password Updated Successfully."
        });


    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            error:error.message,
            message:"Something went wrong while reset password in dataBase"
        });
    }
}   