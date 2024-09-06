import { TouchableOpacity, useColorScheme } from 'react-native'
import { Text } from '../../components/Themed'
import React, { useEffect, useRef, useState } from 'react'
import styles from '@/constants/Styles'
import { View } from '@/components/Themed';
import { usePreferences } from '@/context/PreferencesContext';
import Colors from '@/constants/Colors';
import { backupDatabase, deleteBackups, importBackup, restoreDatabase, shareBackup } from '@/context/useDatabaseBackup';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';


export default function settings() {

  const colorScheme = useColorScheme();
  const { darkModeEnabled, biometricEnabled, updateDarkMode, updateBiometrics, loading } = usePreferences();
  const animation = useRef<LottieView>(null);
  const firstRun = useRef(true);

  const [play, setPlay] = useState(false);

  useEffect(() => {
    setPlay(biometricEnabled)
  }, [biometricEnabled]);


  useEffect(() => {
    if (firstRun.current === true) {
      play ? animation.current?.play(40, 40) : animation.current?.play(4, 4);
      firstRun.current = false;
      console.log(firstRun)
    } else {
      play ? animation.current?.play(4, 40) : animation.current?.play(40, 4);
    }

    // animation.current?.play();
  }, [play]);



  return (
    <View style={styles.containerSetting}>

      {/* <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text children={' Habilitar Modo Escuro(Dark Mode): '} />
        <Switch
          trackColor={{ false: '#00ffff', true: '#00ff00' }}
          thumbColor={darkModeEnabled ? 'green' : 'blue'}
          value={darkModeEnabled}
          onValueChange={(value) => updateDarkMode(value)}
        />
      </View> */}
      <View style={[styles.switchContainer, { width: '95%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>

        <Text style={{ width: 'auto', flexDirection: 'row', }}
          children={' Ativar Biometria: '} />

        <TouchableOpacity
          onPress={() => updateBiometrics(!biometricEnabled)}
        >
          <LottieView
            autoPlay={false}
            ref={animation}
            duration={800}
            loop={false}
            style={{
              width: 60,
              height: 60,
              backgroundColor: 'transparent',
            }}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={require('@/assets/checkBoxLottie.json')}
          />
        </TouchableOpacity>

      </View>
      <BackupRestoreButtons />
    </View>
  )
}

function BackupRestoreButtons() {
  return (
    <View style={{ padding: 20, gap: 20 }}>
      {/* <TouchableOpacity onPress={backupDatabase}>
        <LinearGradient
          colors={["#1387d4", "#259399", "#0b466efa"]}
          start={{ x: 0, y: 0 }} // Gradient starting coordinates
          end={{ x: 0, y: 0.9 }} // Gradient ending coordinates
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}> Backup Database </Text>
        </LinearGradient>
      </TouchableOpacity> */}
      {/* <TouchableOpacity onPress={restoreDatabase}>
        <LinearGradient
          colors={["#1387d4", "#259399", "#0b466e"]}
          start={{ x: 0, y: 0 }} // Gradient starting coordinates
          end={{ x: 0, y: 0.5 }} // Gradient ending coordinates
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}> Restore Database </Text>
        </LinearGradient>
      </TouchableOpacity> */}
      <TouchableOpacity onPress={shareBackup}>
        <LinearGradient
          colors={["#1387d4", "#259399", "#0b466e"]}
          start={{ x: 0, y: 0 }} // Gradient starting coordinates
          end={{ x: 0, y: 0.5 }} // Gradient ending coordinates
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}> Compartilhar Backup </Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={importBackup}>
        <LinearGradient
          colors={["#1387d4", "#259399", "#0b466e"]}
          start={{ x: 0, y: 0 }} // Gradient starting coordinates
          end={{ x: 0, y: 0.5 }} // Gradient ending coordinates
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}> Restaurar do Diretório </Text>
        </LinearGradient>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={deleteBackups}>
        <LinearGradient
          colors={["#1387d4", "#259399", "#0b466e"]}
          start={{ x: 0, y: 0 }} // Gradient starting coordinates
          end={{ x: 0, y: 0.5 }} // Gradient ending coordinates
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}> Delete Database Backup</Text>
        </LinearGradient>
      </TouchableOpacity> */}
    </View>
  );
}