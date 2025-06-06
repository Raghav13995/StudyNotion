const {instance}=require("../config/razorpay")
const {User}=require("../models/User")
const {Course}=require("../models/Course");
const {mailSender}=require("../utils/mailSender");
const {couseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail")
// sabse pehle apne pas ek UI the uspr pay now ka button tha, uspr click krke
// apn ne order create kr diya or order kese create krte hai ek instance banakr
// uspr create method call krte hai.
// apna kam yahi tak tha order create krne tak ab aage kon sambhalega aage 
// rajorpay sambhalega.

// rajorpay ka model khul gya mene pay kr diya QR pr 
// ab payment hogya hai malik k razorpay account mai
// agr successful event hai toh 
// toh ek webhook set hua rakha hoga jo API call krke
// payment status update kr dega

// toh jb humne webhook ko hit kiya toh usme ek API route store
// kr rakha tha usme vo ek verified signature hai jisse hum payment
// status check kr skte hai

// capture the payment and initialte the Razorpay order
exports.capturePayment=async(req,res)=>{
    try{
        // get cousreId and UserId
        const {course_id}=req.body;
        const {userId}=req.user.id;
        // validation
        // valid courseId
        if(!course_id){
            return res.status(400).json({
                success:false,
                message:"Invalid course id"
            })
        }
        // valid course details
        let course;
        try{
            course=await Course.findById({course_id});
            if(!course){
                return res.status(400).json({
                    success:false,
                    message:"Could not find the course",
                })
            }

            // Check whether User already pay for the same course.
            // converting user ID from string form to objectId form.
            // because in studentEnrolled it is in objectId form
            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentEnrolled.includes(uid)){
                return res.status(400).json({
                    success:false,
                    message:"You have already enrolled for this course"
                })
            }
        }catch(error){
            console.log(error);
            return res.status(400).json({
                success:false,
                message:error.message,
                })
        }
        
        // create order:-
        const amount=course.price;
        const currency="INR";

        const options={
            amount:amount*100,
            currency,
            receipt:Math.random(Date.now().toString()),
            notes:{
                courseId:course_id,
                userId
            }
        };

        try{
            // initiate the payment using razorpay
            const paymentResponse=await instance.orders.create(options);
            console.log("Payment Response- ",paymentResponse);  
            return res.status(200).json({
                success:true,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                thumbnail:course.thumbnail,
                orderId:paymentResponse.id,
                amount:paymentResponse.amount,
                currency:paymentResponse.currency,
                message:"Payment initiated successfully",
            })
        }catch(error){
            console.log(error);
            return res.status(400).json({
                success:false,
                message:"Could not initiate order",
            })
        }
        // return response


    }catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Could not capture the payment",
        })

    }
}

// verify Signature of razorpay and Server
exports.verifySignature=async(req,res)=>{
    // y verifySignature ki request hum nhi kr rahe hai 
    // y razorpay mar raha hai.
    
    const webhookSecret="12345678";
    // y razorpay jo request marega uske header m milega(syntax hey)
    // jab raxorpay webhook ko hit karega jab y secret pass hota hai 
    // with key - x-razorpay-signature
    const signature=req.headers['x-razorpay-signature'];
    // or y hash kara hua signature hota hai jisse dicrypt nhi kr sakte
    // toh server vale ko hash krke phir compare kara hai 

    // HMAC k liye 2 chijo ki need hai HASH algo ki or secret key ki 
    // isse apne ko ek HMAC object mil jayega
    const shasum=crypto.createHmac("sha256",webhookSecret);
    // hash based message authentication code.  
    
    // y HMAC object ko string m change kara hai  

    shasum.update(JSON.stringify(req.body));
    const digest=shasum.digest("hex");

    if(signature===digest){
        console.log("Payment is verified");
        // y hame kese pata laga ki yahi pr userid or courseid milegi 
        // toh 2 tarike hai ya toh testing krke pata kr sakte hai 
        // ya razorpay k doc m dhundho.
        const {courseId,userId}=req.body.payload.payment.entity.notes;

        try{
            // fulfill the action

            // find the course and enroll the student
            const enrolledCourse=await Course.findOneAndUpdate(
                                            {_id:courseId},
                                            {$push:{studentEnrolled:userId}},
                                            {new:true}
                                        )
            if(!enrolledCourse){
                return res.status(400).json({
                    success:false,
                    message:"Course not found",
                })    
            }
            console.log(enrolledCourse);

            // find the student and add course in the list of enrolled course
            const enrolledStudent=await User.findOneAndUpdate(
                {_id:userId},
                {$push:{courses:courseId}},
                {new:true}
            )
            if(!enrolledStudent){
                return res.status(400).json({
                    success:false,
                    message:"Student not found",
                })
            }
            console.log(enrolledStudent);
            
            // sending the mail
            const emailResponse= await mailSender(
                enrolledStudent.email,
                "Congratulation",
                "you are onboarded",
            )
            console.log(emailResponse);
            return res.status(200).json({
                success:true,
                message:"Signature verified And course added",
            })

        }catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
    }
    else{
        return res.status(400).json({
            success:false,
            message:"Invalid signature",
        })
    }

}



