import React, { useState, useEffect, useRef } from "react"
import { ScrollView, TextInput, ToastAndroid, useColorScheme, Linking } from "react-native"
import { router, useLocalSearchParams, useNavigation } from "expo-router"
import { NotasDatabase, useNotasDatabase } from "@/database/useNotasDatabase"
import styles from "@/constants/Styles"
import SelectionColor from "@/components/selectionColor"
import RadioGroup from "@/components/radioGroup"
import { mask, MaskedTextInput } from "react-native-mask-text"
import { useModalize } from "react-native-modalize"
import ModalInfo from "@/components/ModalInfo"
import { ActivityIndicator, Button, MD2Colors } from "react-native-paper"
import { View, Text } from "@/components/Themed"
import ToastMessage from "@/components/ToastMessage"
import dados from "@/constants/Dados"
import Checkbox from "expo-checkbox"

type ToastType = 'success' | 'danger' | 'info' | 'warning';

export default function Atualizar() {

  const { ref, open, close } = useModalize();

  const toastRef = useRef<{ show: () => void }>(null);

  // title,  nota ,  valor,  pago,  date,  pinned, cor,  valorParcial
  const [id, setId] = useState(0)
  const [title, setTitle] = useState("")
  const [tel, setTel] = useState("")
  const [nota, setNota] = useState("")
  const [valor, setValor] = useState("")
  const [pago, setPago] = useState("")
  const [date, setDate] = useState("")
  const [pinned, setPinned] = useState(0)
  const [cor, setCor] = useState("")
  const [valorParcial, setValorParcial] = useState("")
  const [valorRestante, setValorRestante] = useState("")
  const [corTexto, setCorTexto] = useState("")
  const [parcela, setParcela] = useState(1)
  const [notas, setNotas] = useState<NotasDatabase[]>([])
  const notasDatabase = useNotasDatabase()
  const params = useLocalSearchParams<{ id: string }>()
  const [mensagem, setMensagem] = useState(dados[0])
  const [loading, setLoading] = useState(true);
  const [enviarWhats, setEnviarWhats] = useState(false)

  const onOpen = (index: number) => {
    setMensagem(dados[index])
    handleShowToast();
    // ref.current?.open();
  };

  const handleShowToast = () => {
    if (toastRef.current) {
      toastRef.current.show();
    }
  };

  function dividirCentavos(valorEmCentavos: any, divisor: number) {
    // // Verificar se o divisor é zero para evitar divisão por zero
    // if (divisor === 0) {
    //   return "Divisor não pode ser zero";
    // }

    // // Verificar se o valor ou o divisor não são números válidos
    // if (isNaN(valorEmCentavos) || isNaN(divisor)) {
    //   return "Valor ou divisor inválido";
    // }

    // Realizar a divisão inteira
    let valorPorParcela = Math.floor(valorEmCentavos / divisor);
    // Obter o restante dos centavos
    let restanteCentavos = valorEmCentavos % divisor;

    // Criar um array para armazenar os valores das parcelas
    let parcelas = new Array(divisor).fill(valorPorParcela);
    console.log(parcelas.map(parcela => parcela.toFixed(0)))
    // Distribuir os centavos restantes
    for (let i = 0; i < restanteCentavos; i++) {
      parcelas[i]++;
    }
    console.log(parcelas.map(parcela => parcela.toFixed(0)))

    // Converter cada parcela para centavos e formatar
    let parcelasEmCentavos = parcelas.map(parcela => parcela.toFixed(0));

    return parcelasEmCentavos;
  }


  async function update() {
    try {

      if (valor.length === 0 || valor === '0') {
        return onOpen(0);
      } else if (pago.length === 0) {
        return onOpen(1);
      } else if (pago === "Parcial") {
        if (valorParcial.length === 0 || valorParcial === '0') {
          return onOpen(2);
        }
      } else if (pago === "Parcelado") {
        if (parcela <= 0) {
          return onOpen(3);
        }
      }

      // Formatar a data atual
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;
      setDate(formattedDate)

      const response = await notasDatabase.update({
        id,
        title,
        tel,
        nota,
        valor,
        pago,
        date : formattedDate,
        pinned,
        cor,
        valorParcial,
        valorRestante,
        corTexto,
        parcela
      })

      if (enviarWhats) {
        const formattedMessage = `Comprador: ${title}\nDados da Compra: ${nota}\nValor: ${mask(valor, '', 'currency',
          {
            prefix: 'R$',
            decimalSeparator: ',',
            groupSeparator: '.',
            precision: 2
          })}\nFoi Pago?: ${pago}${pago === 'Parcial' ? '\nValor Parcial: ' + mask(valorParcial, '', 'currency',
            {
              prefix: 'R$',
              decimalSeparator: ',',
              groupSeparator: '.',
              precision: 2
            }) : ''}${pago === 'Parcial' || pago === 'Não' ? '\nValor Restante: ' + mask(valorRestante, '', 'currency',
              {
                prefix: 'R$',
                decimalSeparator: ',',
                groupSeparator: '.',
                precision: 2
              }) : ''}${pago === 'Parcelado' ? '\nParcelas de: ' + mask(valorRestante, '', 'currency',
                {
                  prefix: 'R$',
                  decimalSeparator: ',',
                  groupSeparator: '.',
                  precision: 2
                }) : ''}${pago === 'Parcelado' ? '\nQuantidade de Parcelas: ' + parcela : ''}\nData: ${formattedDate}`;
        const whatsappLink = `https://wa.me/55${tel}?text=${encodeURIComponent(formattedMessage)}`;
        await Linking.openURL(whatsappLink);
      }


      router.setParams(params)
      router.navigate("/")

      ToastAndroid.show("Nota atualizada!", 3000)
      onOpen(3);
    } catch (error) {
      console.log(error)
    }
  }



  useEffect(() => {
    setLoading(true);
    if (params.id) {
      notasDatabase.show(Number(params.id)).then((response) => {

        if (response) {
          setId(response.id)
          setTitle(response.title)
          setTel(response.tel)
          setNota(response.nota)
          setValor(response.valor)
          setPago(response.pago)
          setDate(response.date)
          setPinned(response.pinned)
          setCor(response.cor)
          setValorParcial(response.valorParcial)
          setValorRestante(response.valorRestante)
          setCorTexto(response.corTexto)
          setParcela(response.parcela)
          setLoading(false)
        }
      })
    }
  }, [params.id])

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: ' Atualize sua Anotação: '
    });
  }, [navigation]);


  async function handleSave() {
    if (params.id) {
      update()
    }
  }

  useEffect(() => {
    if (pago === 'Não') {
      setValorRestante(valor)
    } else if (pago === "Sim") {
      setValorParcial('0')
      setValorRestante('0')
      setParcela(1)
    } else if (pago === 'Parcial') {
      let rest: string = '';
      rest = String(Number(valor) - Number(valorParcial))
      setValorRestante(rest)
      setParcela(1)
    } else if (pago === 'Parcelado' && parcela > 0) {
      if (isNaN(parcela)) {
        return onOpen(3)
      }
      let rest = String(dividirCentavos(valor, parcela));
      setValorRestante(rest);
    }
  }, [pago, valorParcial, valor, parcela])

  const colorScheme = useColorScheme() === 'dark';
  const background = colorScheme ? '#fffffff8' : '#11111110'

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {
        loading ? (
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center"
            }}>
            <ActivityIndicator animating={true} size={40} color={MD2Colors.red800} />
            <Text> Carregando os Dados, Aguarde... </Text>
          </View>

        ) :
          (
            <>
              {/* <Text style={[styles.text, styles.textSublinhado]}> Atualize sua Anotação: </Text> */}
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'nowrap',
                  width: '90%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 10,
                  paddingRight: 20,
                  borderColor: colorScheme ? '#fff' : "#000",
                  borderRadius: 3,
                  borderWidth: 1,
                  backgroundColor: 'transparent',
                  marginHorizontal: 15
                }}
              >
                <Text> Enviar cópia para comprador? </Text>
                <Checkbox
                  style={{
                    width: 25,
                    height: 25
                  }}
                  onValueChange={setEnviarWhats}
                  value={enviarWhats} />
              </View>

              <TextInput
                placeholder='Nome'
                underlineColorAndroid="#4e139c"
                onChangeText={setTitle}
                value={title}
                style={[styles.input, { backgroundColor: background }]} />

              <MaskedTextInput
                placeholder="Telefone no formato ddd-xxxxxxxxx"
                underlineColorAndroid="#4e139c"
                inputMode="numeric"
                mask="999-999999999"
                keyboardType="numeric"
                onChangeText={(text, rawText) => {
                  setTel(rawText)
                }}
                value={tel}
                style={[styles.input, { backgroundColor: background }]} />

              <TextInput
                placeholder='Nota'
                selectionColor={"#ff0"}
                underlineColorAndroid="transparent"
                multiline={true}
                onChangeText={setNota}
                value={nota}
                style={[styles.input, { backgroundColor: background }]} />

              <MaskedTextInput
                placeholder="Valor da Compra"
                underlineColorAndroid="#4e139c"
                defaultValue="0"
                type="currency"
                options={{
                  prefix: 'R$',
                  decimalSeparator: ',',
                  groupSeparator: '.',
                  precision: 2
                }}
                onChangeText={(text, rawText) => {
                  setValor(rawText)
                }}
                value={valor}
                style={[styles.input, { backgroundColor: background }]}
                keyboardType="numeric"
              />

              <RadioGroup initialSelectedOption={pago} title={"Pago? "} onChange={(valor) => {
                setPago(valor);
                if (valor === 'Não' || valor === 'Sim') {
                  setValorParcial('0')
                }
              }
              } />

              {pago === 'Parcial' && (
                <MaskedTextInput
                  type="currency"
                  defaultValue="0"
                  options={{
                    prefix: 'R$',
                    decimalSeparator: ',',
                    groupSeparator: '.',
                    precision: 2
                  }}
                  underlineColorAndroid="#4e139c"
                  onChangeText={(text, rawText) => {
                    setValorParcial(rawText)

                  }}
                  value={valorParcial}
                  style={[styles.input, { backgroundColor: background }]}
                  keyboardType="numeric"
                />
              )}

              {pago === 'Parcelado' && (
                <MaskedTextInput
                  placeholder="Quantidade de Parcelas"
                  underlineColorAndroid="#4e139c"
                  inputMode="numeric"
                  mask="999999999999"
                  keyboardType="numeric"
                  onChangeText={(text, rawText) => {
                    setParcela(Number(rawText))
                  }}
                  value={String(parcela)}
                  style={[styles.input, { backgroundColor: background }]} />
              )}

              <SelectionColor
                onOpen={(cor, index) => {
                  setCor(cor)
                }
                }
                onOpenText={(cor, index) => {
                  setCorTexto(cor)
                }
                }
                cor={cor}
                corT={corTexto} />

              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.button_Native}
                labelStyle={styles.buttonText_Native}
              >
                Salvar
              </Button>

              <ToastMessage
                type={mensagem.tipo}
                text={mensagem.title}
                description={mensagem.message}
                ref={toastRef}
                timeout={mensagem.duration}
              />
            </>
          )
      }


    </ ScrollView>
  )
}


