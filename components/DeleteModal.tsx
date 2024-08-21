import styles from '@/constants/Styles'
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons'
import React, { Component, useRef } from 'react'
import { Dimensions, PressableProps, TouchableOpacity, useColorScheme } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { Portal } from 'react-native-portalize'
import { View, Text } from './Themed'

type Props = PressableProps & {
  dados: {
    modalizeRef: any
    id: Number
  }
  onDelete: () => void
  onCancel: () => void
}
export default function DeleteModal({ dados, onDelete, onCancel, ...rest }: Props) {

  const {height, width} = Dimensions.get('window');

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
        modalHeight={(height - 40)}
        snapPoint={(height / 2)}
        closeSnapPointStraightEnabled={false}
        HeaderComponent={
          <View
            style={{
              justifyContent: "center",
              alignItems: 'center'
            }}>
            <Text style={styles.textTitle}>Deletar </Text>
          </View>
        }
      >
        <View style={[styles.nota, { marginBottom: 40 }]}>
          <Text style={[styles.textTitle, { fontWeight: 400 }]}>Tem Certeza de que deseja deletar esta Nota?</Text>
        </View>
        <View style={styles.viewBtnModal}>
          <TouchableOpacity
            style={styles.btnModal}
            onPress={onDelete}
          >
            <Text style={{fontSize: 20}}>Sim </Text>
            <MaterialIcons name="delete" size={24} color="red" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnModal}
            onPress={onCancel}>
            <Text style={{fontSize: 20}}>Não </Text>
            <MaterialIcons name="close" size={24} color="red" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: 'center'
          }}>
          <Text style={[styles.textTitle, styles.margem20]}>Informações :  </Text>
        </View>
        <View style={[styles.nota]}>
          <Text style={[styles.textTitle, { fontWeight: 400 }]}>
            Selecionando SIM você estará deletando esta anotação, desde que não saia do aplicativo
            é possível recuperar as anotações deletadas pois uma cópia do banco de dados fica salva em seu aparelho,
            quando o aplicativo vai para segundo plano um novo backup é realizado substituindo o anterior, a partir 
            deste ponto não há possibilidade de recuperação.
          </Text>
        </View>
      </Modalize>
    </Portal>
  )
}

