import { auth, firestore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        updateUserData(firebaseUser.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        code: error.code,
      };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(firestore, "users", response.user.uid), {
        name,
        email,
        uid: response.user.uid,
      });
      router.replace("/(tabs)");
      return { success: true };
    } catch (error: any) {
      return { success: false, msg: error.message };
    }
  };

  const updateUserData = async (uid: string): Promise<void> => {
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const userData: UserType = {
          uid: data?.uid,
          name: data.name || null,
          email: data.email || null,
          image: data.image || null,
        };
        setUser({ ...userData });
      }
    } catch (error: unknown) {
      console.error("Failed to update user data:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    logout,
    updateUserData,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be wrapped inside an AuthProvider");
  }

  return context;
};
