import styles from '@/constants/Styles'
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons'
import React, { Component, useRef } from 'react'
import { PressableProps, TouchableOpacity, useColorScheme } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { Portal } from 'react-native-portalize'
import { View, Text } from './Themed'

type Props = PressableProps & {
  dados: {
    modalizeRef: any
    title: string
    message: string
  }
}
export default function ModalInfo({ dados, ...rest }: Props) {

  const colorScheme = useColorScheme();

  // Promessa para evitar erros de rejeição no Modal
  const returnTrueThenFalse = () =>
    new Promise(resolve => setTimeout(() => resolve(false), 1000));
  const handleAvoidKeyboardLikeIOS = () => {
    return true ? true : (returnTrueThenFalse().then() as unknown as boolean);
  };


  return (
    <Portal>
      <Modalize ref={dados.modalizeRef}
        avoidKeyboardLikeIOS={handleAvoidKeyboardLikeIOS()}
        rootStyle={{
          justifyContent: "center",
          alignContent: "center",

        }}
        modalStyle={{
          backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          padding: 15
        }}
        modalHeight={600}
        snapPoint={300}
        closeSnapPointStraightEnabled={false}
        HeaderComponent={
          <View
            style={{
              justifyContent: "center",
              alignItems: 'center'
            }}>
            <Text style={styles.textTitle}>{dados.title} </Text>
          </View>
        }
      >
        <View style={[styles.nota, { marginBottom: 40 }]}>
          <Text style={[styles.textTitle, { fontWeight: 400 }]}>{dados.message}</Text>
        </View>
      </Modalize>
    </Portal>
  )
}

