import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDatabase = async() => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(connectionInstance.connection.host);
    console.log("Connected");
  } catch (error) {
    console.log(error);
   // throw(error)
    process.exit()
  }
};

export default connectDatabase;
