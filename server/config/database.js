const mongoose=require('mongoose');
require('dotenv').config();

exports.connectDB=async()=>{
        mongoose.connect(process.env.MONGODB_URL,{ 
            useNewUrlParser: true, 
            useUnifiedTopology: true           
        }).then(()=>{
            console.log("database connected sucessfully");
        })
        .catch((err)=>{
            console.log("database connection failed");
            console.log(err);
            process.exit(1);
        });
};