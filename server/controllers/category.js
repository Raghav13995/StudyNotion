const Category=require("../models/Category");

// create tag handler function
exports.createCategory=async(req,res)=>{
    try{
        const {name,description}=req.body;
        if(!name||!description){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields"
            });
        }
        // create enrty in Db 
        const categoryDetails=await Category.create({
            name:name,
            description:description
        })
        console.log("Categorydetails: ",categoryDetails);
        return res.status(200).json({
            success:true,
            message:"category created successfully",
            categoryDetails
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// get All Categories 
exports.showAllCategories=async(req,res)=>{
    try{
        // hum kisi attribute k basis pr find nhi kr rahe hai nus itna hai ki jo 
        // bhi entry la rahe hai usme name or description present ho.
        const allCategories=await Category.find({},{name:true,description:true});
        return res.status(200).json({
            success:true,
            message:"All Category fetched successfully",
            data:allCategories,
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            error:error.message,
            message:"Error in Fetching All caegories",
        })
    }
}



//categoryPageDetails 

exports.categoryPageDetails = async (req, res) => {
    try {
        // get categoryId
        const {categoryId}=req.body;
        // get courses for specified categoryId
        const selectedCategory=await Category.findById(categoryId)
                                             .populate("courses")
                                             .exec();

        // validation 
        if(!selectedCategory){
          return res.status(400).json({
            success:false,
            message:"category not found"
          })
        }

        // get courses for different categories:-
        const differentCategories=await Category.find({
                                      _id:{$ne:categoryId},
                                    })
                                    .populate("courses")
                                    .exec();

        // get top selling courses
        // Hw - write it on your own 
        
        // return response
        return res.status(200).json({
            success:true,
            message:"Category page details fetched successfully",
            data:{
              selectedCategory,
              differentCategories,
            }
        });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }
