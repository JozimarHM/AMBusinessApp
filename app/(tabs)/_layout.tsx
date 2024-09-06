import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Image, Pressable, View } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { usePreferences } from '@/context/PreferencesContext';
import BiometricAuth from '@/components/BiometricAuth';

// Componente para o ícone da barra de abas
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string; }) {
  return <FontAwesome size={30} style={{ marginBottom: -3, color: props.color }} {...props} />;
}

export default function TabLayout() {
  
  const { biometricEnabled, loading, darkModeEnabled } = usePreferences();
  const colorScheme = darkModeEnabled ? true : useColorScheme() === 'dark';
  const headerShown = useClientOnlyValue(false, true);

  // Renderização condicional para BiometricAuth
  if (biometricEnabled && loading) {
    return <BiometricAuth />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 12,
        },
        headerStyle: {
          height: 80,
        },
        tabBarStyle: {
          margin: 5,
          height: 55,
          borderRadius: 15,
          position: 'absolute',
          backgroundColor: colorScheme ? '#000' : '#fff',
          bottom: 10,
          left: 10,
          right: 10,
          shadowOpacity: 0,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          backgroundColor: 'transparent',
        },
        tabBarInactiveTintColor: colorScheme ? '#fff' : '#000',
        tabBarActiveTintColor: colorScheme ? '#0ff' : '#033fff',
        headerShown: headerShown,
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: 'transparent' }} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Anotação',
          title: 'AMBusinessApp',
          tabBarIcon: ({ color }) => <TabBarIcon name="sticky-note" color={color} />,
          headerLeft: () => (
            <Image
              style={{ marginLeft: 20, borderRadius: 10, backgroundColor: '#000', width: 40, height: 40 }}
              source={require('../../assets/images/icon2.png')}
            />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ? 'dark' : 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="addNotas"
        options={{
          title: 'Vendas',
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-bag" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configuração',
          tabBarIcon: ({ color }) => <TabBarIcon name="gears" color={color} />,
        }}
      />
    </Tabs>
  );
}
