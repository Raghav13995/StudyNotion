const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User");

// auth
exports.auth=async(req,res,next)=>{
    try{
        // extract token:
        const token=req.cookies.token
                || req.body.token
                || req.header("Authorization").replace("Bearer ","");
        
        // If token missing
        if(!token){
            return res.status(401).json({
                success:false,
                message:"No token, authorization denied"
            });
        }
        // verify token
        console.log("token in Auth Middleware : ----",token);
       
         try{
            console.log("Checking in Process....");
            const decoded=await jwt.verify(token,process.env.JWT_SECRET);
            console.log("decoded",decoded);
            req.user=decoded;
         }catch(error){
            console.log("Error in verify token in Auth Middleware in Auth Middleware",error);
            return res.status(401).json({
                success:false,
                message:"Invalid token or Token Expired Login Again"
            });
         }
         next();

    }catch(error){
         return res.status(401).json({
            succuss:false,
            message:"Validation of Token Failed",
         })
    }
}

// isStudent:
exports.isStudent=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Student"){
            return res.status(401).json({
                success:false,
                message:"You are not a student"
            });
        }
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"Role cant verified",   
        })
    }
}

// isInstructor:-
exports.isInstructor=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:"You are not a Instructor"
            });
        }
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"Role cant verified",   
        })
    }
}

// isAdmin:-
exports.isAdmin=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"You are not a Admin"
            });
        }
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"Role cant verified",   
        })
    }
}

 