import { ResponseType, WalletType } from "@/types";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "./imageService";
import { firestore } from "@/config/firebase";
import { collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    let walletToSave = { ...walletData };
    let oldWalletData: Partial<WalletType> | undefined = undefined;

    if (walletData.id) {
      const oldWalletRef = doc(firestore, "wallets", walletData.id);
      const oldWalletSnap = await getDoc(oldWalletRef);
      if (oldWalletSnap.exists()) {
        oldWalletData = oldWalletSnap.data();
      }
    }

    if (
      walletData.image &&
      typeof walletData.image === "object" &&
      walletData.image.uri
    ) {
      if (!walletData.image.uri.startsWith("http")) {
        const imageUploadRes = await uploadFileToCloudinary(
          walletData.image,
          "wallets"
        );

        if (!imageUploadRes.success) {
          return {
            success: false,
            msg: imageUploadRes.msg || "Falló la subida del ícono.",
          };
        }

        walletToSave.image = imageUploadRes.data;

        if (oldWalletData?.image) {
          await deleteFileFromCloudinary(oldWalletData.image as string);
        }
      } else {
        walletToSave.image = walletData.image.uri;
      }
    }

    if (!walletData.id) {
      walletToSave.amount = 0;
      walletToSave.totalIncome = 0;
      walletToSave.totalExpenses = 0;
      walletToSave.created = new Date();
    }

    const walletRef = walletData.id
      ? doc(firestore, "wallets", walletData.id)
      : doc(collection(firestore, "wallets"));

    await setDoc(walletRef, walletToSave, { merge: true });

    return {
      success: true,
      msg: "Billetera guardada con éxito",
      data: {
        ...walletToSave,
        id: walletRef.id,
      },
    };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};

export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);

    const walletSnap = await getDoc(walletRef);

    if (!walletSnap.exists()) {
      return {
        success: false,
        msg: "La billetera que intentas eliminar no existe.",
      };
    }

    const walletData = walletSnap.data();
    const imageUrl = walletData.image;

    if (imageUrl && typeof imageUrl === "string") {
      await deleteFileFromCloudinary(imageUrl);
    }

    await deleteDoc(walletRef);

    return { success: true, msg: "Billetera eliminada con éxito" };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};
