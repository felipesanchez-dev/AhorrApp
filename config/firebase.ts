import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiRsTjNrlMeRWJDKBNXRMextACGiQ-_sU",
  authDomain: "ahorrapp-ceaea.firebaseapp.com",
  projectId: "ahorrapp-ceaea",
  storageBucket: "ahorrapp-ceaea.firebasestorage.app",
  messagingSenderId: "593215607910",
  appId: "1:593215607910:web:22e30da4cbeb3d0ecd49a7"
};
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const firestore = getFirestore(app);
