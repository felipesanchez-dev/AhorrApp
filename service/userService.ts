import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "./imageService";

export const updateUser = async (
  uid: string,
  updatedData: UserDataType
): Promise<ResponseType> => {
  try {
    const userRef = doc(firestore, "users", uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data() as UserDataType;
    if (updatedData.image && updatedData?.image?.uri) {
      if (
        userData.image &&
        !userData.image.includes("defaultAvatar.png") &&
        updatedData.image.uri
      ) {
        await deleteFileFromCloudinary(userData.image);
      }

      const imageUploadRes = await uploadFileToCloudinary(
        updatedData.image,
        "users"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload image",
        };
      }
      updatedData.image = imageUploadRes.data;
    }

    await updateDoc(userRef, updatedData);
    return { success: true, msg: "Updated successfully" };
  } catch (error: any) {
    console.error("Error updating user:", error);
    return {
      success: false,
      msg: error.message || "Failed to update user",
    };
  }
};
