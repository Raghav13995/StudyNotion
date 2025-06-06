const mongoose=require("mongoose");
require("dotenv").config();

exports.connect=()=>{
     mongoose.connect(process.env.MONGODB_URL)
     .then(()=>console.log("connected to db"))
     .catch((err)=>console.log("not connected to db",err));
}
 