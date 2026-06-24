/**
 * useLocalStorage.js
 * Custom hook for synced localStorage state management.
 */
import { useState, useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      console.error("useLocalStorage write error:", key);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};
