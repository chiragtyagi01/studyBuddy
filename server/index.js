const express = require('express');
const app = express();

const profileRoutes = require('./routes/Profile');
const contactRoutes = require('./routes/Contact');
const paymentRoutes = require('./routes/Payments');
const courseRoutes = require('./routes/Course');
const userRoutes = require('./routes/Users');

const database = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {cloudinaryConnect} = require('./config/cloudinary');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT || 5000;

// database connect
database.connectDB();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"https://localhost:3000",
        credentials:true,
    })
);
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
);

//cloudinary connection
cloudinaryConnect();

//routes

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course",courseRoutes );
app.use("/api/v1/payment", paymentRoutes);

// default route
app.get('/',(req, res)=>{
    return res.json({
        success:true,
        message:`............Your server is running at port no.${PORT}..............`
    });
});

app.listen(PORT, () =>{
    console.log(`Your server is running at port no.${PORT}`)
})