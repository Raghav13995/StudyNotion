const User=require("../models/User");
const OTP=require("../models/OTP");
const otpgenerator=require("otp-generator");
const Profile = require("../models/Profile");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken"); 
const mailSender = require("../utils/mailSender");
require("dotenv").config();
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
// sendOtp
exports.sendOTP=async(req,res)=>{
    try{
        // fetching email
        const{email}=req.body;
        if(!email){
            return res.status(400).json({
                success:false,
                message:"Please provide email",
            })
        }
        // checking if email is already registered
        const checkUserPresent= await User.findOne({email});

        // If user Exist
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User already registered",
            })
        }
        // generate OTP:- 
        var otp=otpgenerator.generate(6,{
            digits:true,
            alphabets:false,
            upperCase:false,
            specialChars:false,
        });
        console.log("Otp generated ",otp);

        // checking unique otp or not:- 
        let result=await OTP.findOne({otp:otp});
        console.log("hi");
        while(result){
            otp=otpgenerator.generate(6,{
                digits:true,
                alphabets:false,
                upperCase:false,
                specialChars:false,
                });
                result=await OTP.findOne({otp:otp});
        }
        console.log("hi2");
        console.log("Otp generated ",otp);
        const otpPayload={email,otp};
        // saving otp in database:-
        console.log("hi3");
        const otpBody=await OTP.create(otpPayload);
        console.log("Otp saved in database ",otpBody);

        // return response successfully 
        res.status(200).json({
            success:true,
            message:"OTP sent successfully",
            otp,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
    
}

// signUp: -
exports.signUp=async (req,res)=>{
    try{
        // data fetch from request
        const{
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            additionalDetails,
            image,
            otp,
        }=req.body;
         
        // validate:- 
        if(!firstName || !lastName||!email||!password||!confirmPassword||!otp){
            return res.status(403).json({
                success:false,
                message:"Please fill all the fields",
            })
        }
        // password matching:-
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirm password does not match",
            });
        }
        
        // check existing User:
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists",
            })
        }
        console.log(email);
        // find most recent OTP stored for user:
        console.log("otp - ",OTP);
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

        
        // This query is used to find a single document in the User
        //  collection based on the email field, sorted by the createdAt
        //   field in descending order, and limited to one result. 
        console.log(recentOtp);
        if(recentOtp.length===0){
            // otp not send
            return res.status(400).json({
                success:false,
                message:"OTP not send",
            })
        }
        console.log("hi1");
        // check otp:
        if(otp!=recentOtp[0].otp){
            return res.status(400).json({
                success:false,
                message:"OTP does not match",
            })  
        }
        // hash password
        const hashedPassword=await bcrypt.hash(password,10);
        
        //entry create in DB:-
        const profileDetails=await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null, 
        })
        // create user:
        const user=await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`
            }) 

            // return res
            return res.status(200).json({
                success:true,
                message:"User created successfully",
                user,
            })
    }catch(error){      
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered.Please try again",
        })
    }
}

// Login: -

exports.login=async(req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please provide email and password",
            })
        }
        // check if user exists:
        const existingUser =await User.findOne({email}).populate("additionalDetails");
        if(!existingUser ){
            return res.status(401).json({
                success:false,
                message:"User does not exist, please Sign up first"
            })
        }
        // check if password is correct:
        if(await bcrypt.compare(password,existingUser.password)){
            // create Payload:
            const payload={
                email:existingUser.email,
                id:existingUser._id,
                accountType:existingUser.accountType,
            }
            // create token:
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            existingUser.toObject();
            existingUser.token=token;
            existingUser.password=undefined;

            const options={
                expiresIn:new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true
            }
            console.log("Token created in backend",token);    
            // create cookie and send response
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                existingUser,
                message:"Logged in Successfully",
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect",
            })
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login Failure, please try again",
        })
    }
}

// change password
exports.changePassword=async(req,res)=>{
    try{
        // Get Data from req body
        const userDetails=await User.findById(req.user.id);
        // get oldPassword,newPassword,confirmNewPassword
        const {oldPassword,newPassword,confirmNewPassword}=req.body;

        // validation
        if(!oldPassword || !newPassword || !confirmNewPassword){
            return res.status(400).json({
                success:false,
                message:"Please fill all fields",
            })
        }

        // validate old Password:-
        const isPasswordMatch=await bcrypt.compare(oldPassword,userDetails.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:"Old Password is incorrect",
            })
        }
        if(newPassword!==confirmNewPassword){
            return res.status(400).json({
                success:false,
                message:"New Password and Confirm New Password does not match",
            })
        }

        // update pwd in DB
        const encryptedPassword=await bcrypt.hash(newPassword,10);
        const updatedUserDetails=await User.findByIdAndUpdate(req.user.id,{password:encryptedPassword},{new:true});
        // send mail-password updated
        try{
            const emailResponse=await mailSender(
                updatedUserDetails.email,
                "Password for your account has been updated",
                passwordUpdated(
                updatedUserDetails.email,
                `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )   
            )
            console.log("Email sent successfully:", emailResponse.response);
        }catch(error){
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", error)
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            })
        }
        // return response
        return res.status(200).json({
            success:true,
            message:"Password updated successfully",
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Password change failure, please try again",
        })
    }
}