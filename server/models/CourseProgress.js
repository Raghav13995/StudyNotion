const mongoose=require("mongoose");

const courseProgress=new mongoose.Schema({
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },

    // userId:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"User",
    // },
    
    // Completed Video will be Array of subsections that
    // are completed
    completedVideos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection",
        }
    ]
})

module.exports=mongoose.model("CourseProgress",courseProgress);