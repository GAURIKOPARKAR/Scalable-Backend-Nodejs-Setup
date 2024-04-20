import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDatabase = async()=>{
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
       console.log(connectionInstance)
        console.log("Connected")
        
    } catch (error) {
        console.log(error)
        

        
    }

}

export default connectDatabase

