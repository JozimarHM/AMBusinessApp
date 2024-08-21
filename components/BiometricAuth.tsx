// BiometricAuth.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image, ToastAndroid } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { usePreferences } from '@/context/PreferencesContext';
import { SplashScreen } from 'expo-router';

const BiometricAuth: React.FC = () => {
    const
    { darkModeEnabled, biometricEnabled, updateDarkMode, updateBiometrics, loading,setLoading } = usePreferences();
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  useEffect(() => {
    if(isBiometricSupported){
        handleBiometricAuth()
    }
  }, [isBiometricSupported]);




  const handleBiometricAuth = async () => {
    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autenticação Biométrica',
      cancelLabel: 'Cancelar',
      disableDeviceFallback: true,
    });

    if (auth.success) {
      ToastAndroid.showWithGravity('Autenticação Bem Sucedida!',
       2000, 20
      );
      setLoading(false)
      SplashScreen.hideAsync();
    } else {
      if (auth.error === 'user_cancel' || auth.error === 'system_cancel') {
        // Re-solicitar autenticação
        Alert.alert(
          'Autenticação necessária',
          'Você precisa autenticar para continuar',
          [
            {
              text: 'Tentar novamente',
              onPress: handleBiometricAuth,
            },
          ]
        );
      } else {
        Alert.alert('Autenticação falhou');
      }
    }
  };

  return (
      <View style={styles.container}>
        {/* <Image style={{width: '100%', height: '40%'}} source={require('../assets/images/icon.png')} /> */}
      {/* <Text>Suporte a Biometria: {isBiometricSupported ? 'Sim' : 'Não'}</Text>
      {isBiometricSupported && (
        <Button title="Autenticar" onPress={handleBiometricAuth} />
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
});

export default BiometricAuth;
