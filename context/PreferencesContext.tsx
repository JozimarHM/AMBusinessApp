// PreferencesContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SplashScreen } from 'expo-router';

interface PreferencesContextProps {
  darkModeEnabled: boolean;
  biometricEnabled: boolean;
  updateDarkMode: (enabled: boolean) => Promise<void>;
  updateBiometrics: (enabled: boolean) => Promise<void>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const PreferencesContext = createContext<PreferencesContextProps | undefined>(undefined);

interface PreferencesProviderProps {
  children: ReactNode;
}

export const PreferencesProvider: React.FC<PreferencesProviderProps> = ({ children }) => {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricEnabled, setBiometricsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const darkMode = await AsyncStorage.getItem('darkMode');
        const biometric = await AsyncStorage.getItem('biometric');
        if (darkMode !== null) {
          setDarkModeEnabled(JSON.parse(darkMode));
        }
        if (biometric !== null) {
          setBiometricsEnabled(JSON.parse(biometric));
          if (!JSON.parse(biometric)) {
            setLoading(false);
            SplashScreen.hideAsync();
          }
        }else{
          SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error('Falha ao carregar preferências.', error);
      } finally {
        // setLoading(false);
      }
    };

    loadPreferences();
  }, []);


  const updateDarkMode = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem('darkMode', JSON.stringify(enabled));
      setDarkModeEnabled(enabled);
    } catch (error) {
      console.error('Failed to update dark mode preference.', error);
    }
  };

  const updateBiometrics = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem('biometric', JSON.stringify(enabled));
      setBiometricsEnabled(enabled);
    } catch (error) {
      console.error('Failed to update biometric preference.', error);
    }
  };

  return (
    <PreferencesContext.Provider
      value={{
        darkModeEnabled,
        biometricEnabled,
        updateDarkMode,
        updateBiometrics,
        loading,
        setLoading,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = (): PreferencesContextProps => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('UsePreferências devem ser usadas dentro de um Provedor de preferências');
  }
  return context;
};
