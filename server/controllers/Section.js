const Section=require("../models/Section");
const Course=require("../models/Course");
const SubSection = require("../models/SubSection");
exports.createSection=async(req,res)=>{
    // data fetch
    try{
        // data fetch
        const {sectionName,courseId}=req.body;

        // data validation:
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                error:"Missing Properties",
            });
        }
        
        // create section:- 
        const newSection=await Section.create({sectionName});

        // update course with section object id 
        const updatedCourseDetails=await Course.findByIdAndUpdate(
                                        courseId,
                                        {
                                            $push:{
                                                courseContent:newSection._id,
                                            }
                                        },
                                        {new:true},
                                    )
                                    .populate({
                                        path: "courseContent",
                                        populate: {
                                            path: "subSection",
                                        },
                                    })
                                    .exec();
                                        
        // HW: use populate to replace sections/sub sections both in 
                                    // the updatedCourseDetails
        // return response:-
        return res.status(200).json({
            success:true,
            message:"section created successfully",
            data:updatedCourseDetails,
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            error:error.message,
            message:'unable to create section',
        })
    }
}

exports.updateSection=async(req,res)=>{
    try{
        // data input:-
        const {sectionName,sectionId}=req.body;

        // data validation
        if(!sectionId || !sectionName){
            return res.status(400).json({
                success:false,
                error:"Missing Properties",
            });
        }
        // update data:-
        console.log("section id to update - ",sectionId);
        console.log("section Name to update - ",sectionName);
        const updatedSection=await Section.findByIdAndUpdate(
            sectionId,
            {
                sectionName,
            },
            {new:true},
        );

        console.log("updated Section ",updatedSection);
        // return response:-
        return res.status(200).json({
            success:true,   
            message:"section updated successfully",
            data:updatedSection,
        }); 

    }catch(error){
        return res.status(500).json({
            success:false,
            error:error.message,
            message:'unable to update section',
        })
    }
}

// delete section:-
exports.deleteSection=async(req,res)=>{
    try{
        // section id - we are sending id in params:

        const {sectionId,courseId}=req.body

        await Course.findByIdAndUpdate(courseId,{
            $pull:{
                courseContent:sectionId,
            }
        })

        const section=await Section.findById(sectionId);
        console.log(sectionId,courseId);

        if(!section){
            return res.status(404).json({
                success:false,
                message:"section not found",
            })
        }

        // delete Sub Section:-
        await SubSection.deleteMany({_id : {$in: section.subSection}});

        //use findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);

        // find the updated course and return:-
        const updatedCourse=await Course.findById(courseId)
        .populate({
            path:'courseContent',
            populate:{
                path:'subSection',
            }
        })
        .exec();

        // return response:-
        return res.status(200).json({
            success:true,
            message:"section deleted successfully",
            data:updatedCourse
        });
    
    }catch(error){
        return res.status(500).json({
            success:false,
            error:error.message,
            message:'unable to delete section',
        })
    }
}