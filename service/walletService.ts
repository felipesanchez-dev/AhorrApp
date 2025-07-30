import { ResponseType, WalletType } from "@/types";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "./imageService";
import { firestore } from "@/config/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    let walletToSave = { ...walletData };
    let oldWalletData: Partial<WalletType> | undefined = undefined;

    // If updating, get old wallet data
    if (walletData.id) {
      const oldWalletRef = doc(firestore, "wallets", walletData.id);
      const oldWalletSnap = await getDoc(oldWalletRef);
      if (oldWalletSnap.exists()) {
        oldWalletData = oldWalletSnap.data();
      }
    }

    if (walletData.image && typeof walletData.image !== "string") {
      const imageUploadRes = await uploadFileToCloudinary(
        walletData.image,
        "wallets"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload wallet icon",
        };
      }
      walletToSave.image = imageUploadRes.data;

      //delete old image
      if (oldWalletData && oldWalletData.image) {
        await deleteFileFromCloudinary(oldWalletData.image as string);
      }
    }
    if (!walletData?.id) {
      walletToSave.amount = 0;
      walletToSave.totalIncome = 0;
      walletToSave.totalExpenses = 0;
      walletToSave.created = new Date();
    }

    const walletRef = walletData.id
      ? doc(firestore, "wallets", walletData?.id)
      : doc(collection(firestore, "wallets"));

    await setDoc(walletRef, walletToSave, { merge: true });
    return {
      success: true,
      msg: "Wallet saved successfully",
      data: {
        ...walletToSave,
        id: walletRef.id,
      },
    };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};
