import { Button, ImageBackground, Switch, TouchableOpacity, useColorScheme } from 'react-native'
import { Text } from '../../components/Themed'
import React, { useEffect, useState } from 'react'
import styles from '@/constants/Styles'
import { View } from '@/components/Themed';
import { usePreferences } from '@/context/PreferencesContext';
import Colors from '@/constants/Colors';
import { backupDatabase, deleteBackups, restoreDatabase } from '@/context/useDatabaseBackup';
import { LinearGradient } from 'expo-linear-gradient';

const image = require('@/assets/images/icon2.png');

export default function settings() {

  const colorScheme = useColorScheme();
  const
    { darkModeEnabled, biometricEnabled, updateDarkMode, updateBiometrics, loading } = usePreferences();


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
      <View style={[styles.switchContainer, { width: '100%', flexDirection: 'row', justifyContent: 'space-between' }]}>

        <Text style={{ width: 'auto', flexDirection: 'row' }}
          children={' Ativar Biometria: '} />
        <Switch
          trackColor={{ false: '#00ffff', true: '#00ff00' }}
          thumbColor={biometricEnabled ? 'green' : 'blue'}
          value={biometricEnabled}
          onValueChange={(value) => updateBiometrics(value)}
        />
      </View>
      <BackupRestoreButtons />
    </View>
  )
}

function BackupRestoreButtons() {
  return (
    <View style={{ padding: 20, gap: 20 }}>
      <TouchableOpacity onPress={backupDatabase}>
        <LinearGradient
          colors={["#1387d4", "#259399", "#0b466efa"]}
          start={{ x: 0, y: 0 }} // Gradient starting coordinates
          end={{ x: 0, y: 0.9 }} // Gradient ending coordinates
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}> Backup Database </Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={restoreDatabase}>
        <LinearGradient
          colors={["#1387d4", "#259399", "#0b466e"]}
          start={{ x: 0, y: 0 }} // Gradient starting coordinates
          end={{ x: 0, y: 0.5 }} // Gradient ending coordinates
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}> Restore Database </Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={deleteBackups}>
        <LinearGradient
          colors={["#1387d4", "#259399", "#0b466e"]}
          start={{ x: 0, y: 0 }} // Gradient starting coordinates
          end={{ x: 0, y: 0.5 }} // Gradient ending coordinates
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}> Delete Database Backup</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}