import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";




// Configuration
await cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

// Upload an image
const uploadONCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfull
        //console.log("file is upload on cloundinary \n");
        //console.log(response.url);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.error("Cloudinary upload failed:", error.message)
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation  got faild 
        return null;
    }
}

const deleteFromCloudinary = async (url, resourceType = "image") => {
    try {
        if (!url) return null

        const publicId = url.split("/").pop().split(".")[0]

        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        })

        return response
    } catch (error) {
        console.log("Error deleting from cloudinary", error)
        return null
    }
}

export { uploadONCloudinary, deleteFromCloudinary }