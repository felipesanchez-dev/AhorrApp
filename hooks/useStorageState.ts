import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const useStorageState = (key: string) => {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStorage = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(key);
        setValue(storedValue);
      } catch (error) {
        console.error("Failed to fetch from AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    checkStorage();
  }, [key]);

  return { value, loading };
};
