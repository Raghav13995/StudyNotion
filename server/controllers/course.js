const Course=require("../models/Course");
const User=require("../models/User");
const {uploadImageToCloudinary}=require("../utils/imageUploader");
const Category = require("../models/Category");

// create course handler function
exports.createCourse=async(req,res)=>{
    try{    
        console.log("hello from course controller");
        // fetch data:-
        const {courseName,courseDescription,whatYouWillLearn,price,tag:tag,category}=req.body;

        // get thumbnail
        const thumbnail = req.files.thumbnailImage;

        // console.log("courseName",courseName)
        // console.log("courseD",courseDescription)
        // console.log("what u will ",whatYouWillLearn)
        // console.log("price",price)
        // console.log("tag",tag)
        // console.log("thunmnail",thumbnail)


        // validation:
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields"
            })
        }

        // check for instructor
        const userId=req.user.id;
        console.log(userId);
        const instructorDetails=await User.findById(userId);
        console.log("Instructor details: ",instructorDetails);


        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:"Instructor Details not found"
            });
        }
        // check given tag is valid or not
        const categoryDetails=await Category.findById(category);
        console.log("category details",categoryDetails)
        if(!categoryDetails){       
            return res.status(400).json({
                success:false,
                message:"category details not found"
            })
        }
        // upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
        const newCourse=await Course.create ({
            courseName,
            courseDescription,
            whatYouWillLearn:whatYouWillLearn,
            price:price,
            tag,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            instructor:instructorDetails._id,
        })
         
        // add new course to the user schema of instructor:-
        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},{
                $push:{
                    courses:newCourse._id,
                }
            },
            {new:true}
        );
        // update the category ka schema
        await Category.findByIdAndUpdate(
            {_id:categoryDetails._id},{
                $push:{
                    courses:newCourse._id,
                }
            },
            {new:true}
        );
        // send response
        return res.status(200).json({
            success:true,
            message:"Course created successfully",
            newCourse,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create course",
            error:error.message,
        })
    }
}


// getAllCourses handler function:-
exports.getAllCourses=async(req,res)=>{
    try{
        const allCourses=await Course.find({},{
                                                courseName:1,
                                                price:true,
                                                thumbnail:true,
                                                instructor:true,
                                                ratingAndReviews:true,
                                                studentEnrolled:true,
                                            }).populate("instructor");
        return res.status(200).json({
            success:true,
            message:"All courses fetched successfully",
            data:allCourses,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to get all courses",
            error:error.message,
        })
    }
}




//getCourseDetails
exports.getCourseDetails=async(req,res)=>{
    try{
        // fetch get course id:
        const {courseId}=req.body;
        console.log("hello1");
        // fetch course details:
        const courseDetails=await Course.findById({_id:courseId})
                                        .populate(
                                            {
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails",
                                                }
                                            }       
                                        )   
                                        .populate("category")
                                        .populate("ratingAndReviews")
                                        .populate({
                                            path:"courseContent",
                                            populate: {
                                                path:"subSection",
                                            }
                                        })
                                        .exec();
                                        console.log("hello2");
        console.log("check",courseDetails)
        //validation:-
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`Course not found of courseId ${courseId}`,
            }) 
        }   
        
        // return response
        return res.status(200).json({
            success:true,
            message:"Course details fetched successfully",
            data:courseDetails,
         })


    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to get course details",
            error:error.message,
            })
    }
} 

