const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");
const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
})
// To send email:-

async function sendVerificationEmail(email,otp){
    // .Create a transporter to send mails
    // define the email options
    // send the mail
    try{
        const mailResponse=await mailSender(email,"Verification From StudyNotion",emailTemplate(otp));
        console.log("Email sent successfully - ",mailResponse);
    }catch(error){
        console.log("Error while sending mail - ",error);
        throw error;
    }
}
// document save hone se just pehle y function run kare:-  
OTPSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next(); 
})
// The hook is attached to the OTPSchema and specifically triggers
// before an OTP document is saved to the database.

module.exports=mongoose.model("OTP",OTPSchema);