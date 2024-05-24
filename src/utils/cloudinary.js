import dotenv from "dotenv"
dotenv.config({path:'./.env'})
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

// console.log("In cloudinary")
// console.log(process.env.ACCESS_TOKEN_SECRET);
// console.log(process.env.CLOUDINARY_API_KEY);
// console.log(process.env.CLOUDINARY_API_SECRET);

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:true
});

const uploadonCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const deleteFromCloudinary = async (userFileUrl) => {
    try {
        if (!userFileUrl) return null;

        // Extract the public ID from the URL
        const publicIdMatch = userFileUrl.match(/\/v\d+\/(.+)\.\w+$/);
        if (!publicIdMatch) {
            console.error("Invalid Cloudinary URL");
            return null;
        }

        const publicId = publicIdMatch[1];
        console.log("Public ID:", publicId);

        const response = await cloudinary.uploader.destroy(publicId);
        console.log("Response from Cloudinary:", response);
        return response;

    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        return null;
    }
}




export {uploadonCloudinary , deleteFromCloudinary}