// require('dotenv').config({path:'/.env'})
import dotenv from "dotenv"
dotenv.config({path:'./.env'})
import connectDatabase from "./db/db.js";
import app from "./app.js";

// console.log(process.env.ACCESS_TOKEN_SECRET);
// console.log(process.env.CLOUDINARY_CLOUD_NAME);
// console.log(process.env.CLOUDINARY_API_KEY);
console.log("index.js" + process.env.CLOUDINARY_API_SECRET);


connectDatabase().
then(()=>{
    app.listen(process.env.PORT|| 8000, ()=>{
        console.log("listening")
    })
   
}).
catch((error)=>{
    console.log("Could not connect to mongodb",error)
})


