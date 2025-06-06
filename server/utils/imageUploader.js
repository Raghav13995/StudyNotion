const cloudinary=require("cloudinary").v2;

exports.uploadImageToCloudinary=async(file,folder,height,quality)=>{
    const options={folder};
    if(height){
        options.height=height;
    }
    if(quality){
        options.quality=quality;
    }
    // height or quality image k compression k liye thi
    options.resource_type="auto";
    // kis type ka resource hai automatic determine kr lega 
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}