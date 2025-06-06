const nodemailer=require("nodemailer");
const mailSender=async(email,title,body)=>{
    try{
        let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        })

        let info=await transporter.sendMail({
            from:'StudyNotion || By Raghav Agrawal',
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        console.log(info);
        return info;
    }catch(error){
        console.log(error.message);
        return ({
            success:false,
            message:"Not running"
        })
        throw error;
    }
}

module.exports=mailSender;