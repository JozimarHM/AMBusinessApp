import styles from '@/constants/Styles';
import React, { useEffect } from 'react';
import { Image, ImageProps, PressableProps, StyleProp, StyleSheet, TextStyle, View, ViewProps, ViewStyle } from 'react-native';
import { MaskedText } from 'react-native-mask-text';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';


type Props = PressableProps & {
  data: {
    id: number
    title: string
    tel: string
    nota: string
    valor: string
    pago: string
    date: string
    pinned: number
    cor: string
    valorParcial: string
    valorRestante: string
    corTexto: string
    parcela: number

  }
  onDelete: () => void
  onOpen: () => void
  onLongPressOpen: () => void
}


export default function CustomCard({ data, onDelete, onOpen, onLongPressOpen, ...rest }: Props) {


  var badgeBig: any;
  let RightContent;

  if (data.title?.length > 0 && data.title?.length !== undefined) {
    var step1 = data.title.replace(/\s(de|da|dos|do|das)\s/g, ' '); // Remove os de,da, dos,das.
    var iniciais = step1.match(/\b(\w)/gi); // Iniciais de cada parte do nome.
    var IniciaisNomes: any = iniciais?.splice(iniciais.length - 2).join(''); // Iniciais
    badgeBig = (props: React.JSX.IntrinsicAttributes & ViewProps & React.RefAttributes<View> & { label: string; size?: number; color?: string; style?: StyleProp<ViewStyle>; labelStyle?: StyleProp<TextStyle>; maxFontSizeMultiplier?: number; theme?: ThemeProp; }) => <Avatar.Text {...props}
      style={{ borderRadius: 30, backgroundColor: '#00FFFF' }}
      theme={{ colors: { primary: '#f0f' } }}
      label={IniciaisNomes} color='#8B008B' />

  } else {
    badgeBig = (props: React.JSX.IntrinsicAttributes & ViewProps & React.RefAttributes<View> & { icon: IconSource; size?: number; color?: string; style?: StyleProp<ViewStyle>; theme?: ThemeProp; }) => <Avatar.Icon {...props}
      style={{ backgroundColor: '#f00', }}
      icon="emoticon" />
  }

  if (data.pinned > 0) {
    RightContent = <Image style={{ width: 30, height: 25 }} source={require('../assets/images/ic_pin2.png')} />
  } else {
    RightContent = <Image style={{ width: 0, height: 0 }} source={require('../assets/images/ic_pin2.png')} />
  }

  return (

    <Card
      elevation={2}
      contentStyle={{
        backgroundColor: data.cor || '#777',
        borderRadius: 10,
        margin: 2,
        padding: 5
      }}
      style={{
        margin: 5,
      }}
    >

      <Card.Title
        titleNumberOfLines={2}
        titleStyle={{
          color: data.corTexto || '#fff',
          fontSize: 20,
        }}
        subtitleStyle={{
          color: data.corTexto || '#fff',
          fontSize: 16,
        }}
        leftStyle={{
          backgroundColor: "#fff",
          borderRadius: 50
        }}
        rightStyle={{}}
        subtitleNumberOfLines={5}
        title={data.title}
        subtitle={data.tel}
        left={badgeBig}
        right={() => RightContent}
      />

      <Card.Content
        style={{
          // justifyContent: 'space-between'
        }}
      >
        {/* <Text style={{ color: '#fff' }} variant="bodyLarge">{data.nota} </Text> */}
        {data.nota?.length > 0 && (
          <View style={{
            flexDirection: 'row',
            padding: 2, borderRadius: 5,
            marginBottom: 10,
          }}>
            <Text style={{ color: data.corTexto || '#fff', }}
              variant="bodyLarge">
              {data.nota}
            </Text>
          </View>
        )}
        {data.valor?.length > 0 && (
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: data.corTexto || '#fff', }}>
              Valor da Compra:
            </Text>
            <MaskedText
              style={[styles.maskedText, { color: data.corTexto || '#fff' }]}
              type="currency"
              options={{
                prefix: 'R$',
                decimalSeparator: ',',
                groupSeparator: '.',
                precision: 2
              }}
            >
              {data.valor}
            </MaskedText>
          </View>
        )}

        {data.pago?.length > 0 && (
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: data.corTexto || '#fff', }}>
              Status da venda(Pago?):
            </Text>
            <Text style={[styles.maskedText, { color: data.corTexto || '#fff' }]}
              variant="titleSmall">
              {data.pago}
            </Text>
          </View>
        )}
        {data.pago === 'Parcial' && (
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: data.corTexto || '#fff', }}>
              Valor Parcial Pago:
            </Text>
            <MaskedText
              style={[styles.maskedText, { color: data.corTexto || '#fff' }]}
              type="currency"
              options={{
                prefix: 'R$',
                decimalSeparator: ',',
                groupSeparator: '.',
                precision: 2
              }}>
              {data.valorParcial}
            </MaskedText>
          </View>
        )}

        {(data.pago === 'Parcial' || data.pago === 'Não') && (
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: data.corTexto || '#fff', }}>
              Valor Restante:
            </Text>
            <MaskedText
              style={[styles.maskedText, { color: data.corTexto || '#fff' }]}
              type="currency"
              options={{
                prefix: 'R$',
                decimalSeparator: ',',
                groupSeparator: '.',
                precision: 2
              }}>
              {data.valorRestante}
            </ MaskedText>
          </ View>
        )}
        {(data.pago === 'Parcelado') && (
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: data.corTexto || '#fff', }}>
              Valor de cada Parcela:
            </Text>
            <MaskedText
              style={[styles.maskedText, { color: data.corTexto || '#fff' }]}
              type="currency"
              options={{
                prefix: 'R$',
                decimalSeparator: ',',
                groupSeparator: '.',
                precision: 2
              }}>
              {data.valorRestante}
            </ MaskedText>
          </ View>
        )}
        {(data.pago === 'Parcelado') && (
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: data.corTexto || '#fff', }}>
              Quantidade Total de Parcelas:
            </Text>
            <Text
              style={[styles.maskedText, { color: data.corTexto || '#fff' }]}
            >
              {data.parcela}
            </Text>
          </View>
        )}



      </Card.Content>
      {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
      <Card.Actions
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          alignContent: 'space-between',
          alignSelf: 'center'
        }}
      >
        <Button
          theme={{ colors: { primary: '#fff' } }}
          style={{
            borderColor: '#fff'
          }} onPress={onDelete} >Deletar</Button>
        <Button
          onPress={onOpen}
          theme={{ colors: { primary: data.corTexto? data.corTexto + '85': '#ff000075' } }} // Define a cor primária do tema
        >
          Atualizar
        </Button>
      </Card.Actions>
    </Card>
  )
};
