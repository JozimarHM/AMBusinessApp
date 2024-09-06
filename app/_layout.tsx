import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Theme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SQLiteProvider, SQLiteStatement } from 'expo-sqlite';
import { Slot, Stack } from 'expo-router';
import { Host } from "react-native-portalize"
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import 'react-native-reanimated';
import { initializeDatabaseVendas } from "@/database/initializeDatabaseVendas"
import { useColorScheme } from '@/components/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PreferencesProvider } from '@/context/PreferencesContext';
import { backupDatabase, restoreDatabase } from '@/context/useDatabaseBackup';
import { AppState } from 'react-native';


export {
  // Pegue quaisquer erros lançados pelo componente de layout.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Certifique -se de recarregar o `/modal`, mantenha um botão traseiro presente.
  initialRouteName: '(tabs)',
};

// Evite que a tela de respingo de ocultação automática 
// antes da conclusão do carregamento de ativos.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const handleAppStateChange = (nextAppState: any) => {
      console.log(appState.current)
      if (appState.current.match(/active/)) {
        console.log('O aplicativo está em segundo plano ou pausa.');
        // backupDatabase();
      }
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('O aplicativo retornou do segundo plano ou pausa.');
        // backupDatabase();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });


  // O roteador Expo usa limites de erro para capturar erros na árvore de navegação.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }


  return <RootLayoutNav />;
}

export const DarkTheme: Theme = {
  dark: true,
  colors: {
    primary: 'rgb(10, 132, 255)',
    background: 'rgb(1, 1, 1)',
    card: 'rgb(18, 18, 18)',
    text: 'rgb(229, 229, 231)',
    border: 'rgb(39, 39, 41)',
    notification: 'rgb(255, 69, 58)',
  },
};

export const DefaultTheme: Theme = {
  dark: false,
  colors: {
    primary: 'rgb(10, 12, 255)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)',
  },
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  // useEffect(() => {
  //   restoreDatabase();

  //   // const backupInterval = setInterval(backupDatabase, 24 * 60 * 60 * 1000); // Faz backup a cada 24 horas
  //   const backupInterval = setInterval(backupDatabase, 24 * 60 * 60 * 1000); // Faz backup a cada 24 horas

  //   return () => clearInterval(backupInterval);
  // }, []);

  return (
    <PreferencesProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <SQLiteProvider
            databaseName="notas.db"
            options={{
              enableChangeListener: true,
            }}
            onInit={initializeDatabaseVendas}>
            {/* <Slot /> */}
            <Host>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
              </Stack>
            </Host>
          </SQLiteProvider >
        </ThemeProvider>
      </GestureHandlerRootView>
    </PreferencesProvider>
  );
}
