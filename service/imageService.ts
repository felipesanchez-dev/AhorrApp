import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "@/constants/cloudinary";
import { ResponseType } from "@/types";
import axios from "axios";
import sha1 from "crypto-js/sha1";

const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}`;

export const uploadFileToCloudinary = async (
  file: { uri?: string } | string,
  folderName: string
): Promise<ResponseType> => {
  try {
    if (!file) return { success: true, data: null };
    if (typeof file === "string") {
      return { success: true, data: file };
    }
    if (file && file.uri) {
      const formData = new FormData();

      const filename = file.uri.split("/").pop() || "file.jpg";
      const extension = filename.split(".").pop()?.toLowerCase();

      const mimeTypes: { [key: string]: string } = {
        jpg: "image/jpg",
        jpeg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
      };

      const mimeType = mimeTypes[extension || ""] || "image/jpeg";

      formData.append("file", {
        uri: file.uri,
        type: mimeType,
        name: filename,
      } as any);

      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", folderName);

      const response = await axios.post(
        `${CLOUDINARY_API_URL}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return { success: true, data: response?.data?.secure_url };
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      msg: error.message || "Failed to upload file",
    };
  }
};

export const deleteFileFromCloudinary = async (
  imageUrl: string
): Promise<ResponseType> => {
  try {
    const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = sha1(
      `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`
    ).toString();

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", CLOUDINARY_API_KEY);
    formData.append("signature", signature);

    const response = await axios.post(
      `${CLOUDINARY_API_URL}/image/destroy`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      msg: error.message || "Failed to delete file",
    };
  }
};

export const getProfileImage = (file: any) => {
  if (file && typeof file === "string") return file;
  if (file && typeof file === "object" && file.uri) return file.uri;
  return require("../assets/images/defaultAvatar.png");
};

export const getFilePath = (file: any) => {
  if (file && typeof file === "string") return file;
  if (file && typeof file === "object" && file.uri) return file.uri;
  return null;
};
