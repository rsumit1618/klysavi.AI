import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Universal secure storage helper with automatic fallback to AsyncStorage
 * for payloads larger than 2048 bytes (which exceeds native Keychain/KeyStore limits).
 */
export const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const value = await SecureStore.getItemAsync(key);
      if (value !== null) return value;
    } catch (e) {}
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      // SecureStore on Android/iOS has a strict 2048-byte value limit.
      // If the string length exceeds 2000 bytes, persist in AsyncStorage to prevent warnings & native failures.
      if (value && value.length > 2000) {
        await AsyncStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (e) {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (err) {
        console.error('Error saving storage item:', err);
      }
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (e) {}
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {}
  },
};
