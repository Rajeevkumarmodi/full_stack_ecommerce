import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    return response;
  } catch (error) {
    return null;
  }
};

const deleteOnCloudinary = async (imageName) => {
  if (!imageName) {
    return null;
  }

  const result = await cloudinary.uploader.destroy(imageName);
  return result;
};

export { uploadOnCloudinary, deleteOnCloudinary };
