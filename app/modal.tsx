import { StatusBar } from 'expo-status-bar';
import { Button, Platform, StyleSheet } from 'react-native';

// import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import {  useNavigation } from 'expo-router';
import styles from '@/constants/Styles';
import { useEffect } from 'react';

export default function ModalScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Informações '
    });
  }, [navigation]);
  return (
    <View style={[styles1.container, { margin: 5, borderRadius: 15 }]}>
      <Text style={[styles.title,{
          fontStyle: 'italic',
          textDecorationLine: 'underline',
          textShadowRadius: 2
      }]}>AMBUsinessAPP</Text>
      <Text style={{
        fontSize: 16,
        fontStyle: 'italic',
        textShadowRadius: 5
      }}>
        Aplicação Assistente de Gerenciamento de Negócios  </Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Text style={{ fontSize: 18 }}>
        É um aplicativo onde o usuário que tenha algum tipo de atividade econômica possa estar
        efetuando não apenas suas anotações, como também ter um controle das vendas e da condição de
        venda dos produtos( por exemplo o Status: Pago, Não Pago ou Parcial), podendo manter um registro do perfil
        dos compradores, itens vendidos e muito mais no campo Nota, o campo telefone pode ser usado para futura pesquisa
        de satisfação dos clientes, podendo o vendedor enviar uma cópia da anotação para o comprador via WhatApp no
        momento da criação da Nota se este desejar.
      </Text>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {/* <EditScreenInfo path="app/modal.tsx" /> */}

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
