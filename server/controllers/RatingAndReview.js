const RatingAndReview=require("../models/RatingAndReview");
const User=require("../models/User");
const Course=require("../models/Course");
const { default: mongoose } = require("mongoose");

// create Rating 
exports.createRating=async(req,res)=>{
    try{
        // get userId
        const userId=req.user.id;
        // fetch data from req body
        const {rating,review,courseId}=req.body;
        // check whether user enrolled course or not
        // In MongoDB, the $elemMatch operator is used to 
        // match documents that contain an array field with 
        // at least one element that matches all the specified 
        // query criteria.
        const courseDetails=await Course.findOne({
                                _id:courseId,
                                studentEnrolled:{$elemMatch:{$eq: userId}},
                            });
            if(!courseDetails){
                return res.status(400).json({
                    success:false,
                    message:"You are not enrolled in this course."
                });
            }
                            
        // check user already reviewed
        const alreadyReviewed=await RatingAndReview.findOne({
                                            user:userId,
                                            course:courseId
                                        })
            if(alreadyReviewed){
                return res.status(400).json({
                    success:false,
                    message:"You already reviewed this course."
                });
            }
        // create rating and review
        const ratingReview=new RatingAndReview.create({
                                        rating,review,
                                        course:courseId,
                                        user:userId,
                                    })

        // update course with this rating
        const updatedCourseDetails=await Course.findByIdAndUpdate({_id:courseId},
                                        {
                                            $push:{
                                                ratingAndReviews:ratingReview._id
                                              }
                                        },
                                        {new:true}
                                    )
        console.log("Updated course detils- ",updatedCourseDetails);
        // return response
        return res.status(200).json({
            success:true,
            message:"Review added successfully.",
            ratingReview,
        });


    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"unable to rate",
            error:error.message,
        })
    }
}


// get Average rating
exports.getAverageRating=async(req,res)=>{
    try{
            // get course id
            const courseId=req.body.courseId;

            // calculate avg rating:
            const result=await RatingAndReview.aggregate([
                // course Id pehle string thi usse bhi object id m chnge krna padega
                {
                    $match:{
                        course:new mongoose.Types.ObjectId(courseId),
                    },
                },
                {
                    $group:{
                        _id:null,
                        avgRating:{$avg:"$rating"},
                    }
                }
            ])

            // return rating:-
            if(result.length>0){
                return res.status(200).json({
                    success:true,
                    message:"Average rating found",
                    averageRating:result[0].averageRating,
                }) 
            }

            // if no rating/review exist:- 
            return res.status(200).json({
                success:true,
                message:"Average rating is 0, no ratings given till now",
                averageRating:0,
            })

    }catch(error){
        console.log(error); 
        return res.status(500).json({
            message:"unable to get average rating",
            error:error.message,
        })
    }
}


// get All rating:
exports.getAllRating=async(req,res)=>{
    try{
        const allReviews=await RatingAndReview.find({})
                               .sort({rating:"desc"})
                               .populate({
                                path:"user",
                                select:"firstName lastName email image",
                               })
                               .populate({
                                path:"course",
                                select:"courseName",
                               })
                               .exec();
        return res.status(200).json({
            success:true,
            message:"All ratings found",
            data:allReviews,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"unable to get all rating",
            error:error.message,
        })
    }
}