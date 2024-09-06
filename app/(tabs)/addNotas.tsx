import React, { useEffect, useRef, useState } from "react"
import { Button, Alert, ScrollView, Linking, useColorScheme, Keyboard, TouchableOpacity, TouchableWithoutFeedback } from "react-native"

import {
  NotasDatabase,
  useNotasDatabase
} from "@/database/useNotasDatabase"
import { MaskedTextInput, Text, TextInput, useThemeColor, View } from "@/components/Themed"
import SelectionColor from "@/components/selectionColor"
import RadioGroup from "@/components/radioGroup"
// import { MaskedTextInput, unMask } from "react-native-mask-text"
import styles from "@/constants/Styles"
import ModalInfo from "@/components/ModalInfo"
import { useModalize } from "react-native-modalize"
import ToastMessage from "@/components/ToastMessage"
import ButtonToast from "@/components/ButtonToast"
import dados from "@/constants/Dados"
import Checkbox from "expo-checkbox"
import { mask } from "react-native-mask-text"

type PagoType = 'Sim' | 'Não' | 'Parcial' | 'Parcelado';

const options = [
  { key: 'sim', text: 'Sim' },
  { key: 'nao', text: 'Não' },
  { key: 'parcial', text: 'Parcial' },
  { key: 'parcelado', text: 'Parcelado' },
];

export default function AddNotas() {

  const { ref, open, close } = useModalize();

  const toastRef = useRef<{ show: () => void }>(null);


  // title,  nota ,  valor,  pago,  date,  pinned, cor,  valorParcial
  const [id, setId] = useState("")
  const [search, setSearch] = useState("")
  const [title, setTitle] = useState("")
  const [tel, setTel] = useState("")
  const [nota, setNota] = useState("")
  const [valor, setValor] = useState("0")
  const [pago, setPago] = useState<PagoType>("Sim")
  const [date, setDate] = useState("")
  const [pinned, setPinned] = useState(0)
  const [cor, setCor] = useState("")
  const [valorParcial, setValorParcial] = useState("0")
  const [valorRestante, setValorRestante] = useState("")
  const [corTexto, setCorTexto] = useState("")
  const [parcela, setParcela] = useState(1)
  const [notas, setNotas] = useState<NotasDatabase[]>([])
  const [mensagem, setMensagem] = useState(dados[0])
  const [enviarWhats, setEnviarWhats] = useState(false)

  const notasDatabase = useNotasDatabase()

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

    // Distribuir os centavos restantes
    for (let i = 0; i < restanteCentavos; i++) {
      parcelas[i]++;
    }

    // Converter cada parcela para centavos e formatar
    let parcelasEmCentavos = parcelas.map(parcela => parcela.toFixed(0));
    console.log(parcelas.map(parcela => parcela.toFixed(0)))

    return parcelasEmCentavos;
  }

  // // Exemplos de uso
  // let resultado1 = dividirCentavos(528, 53);
  // console.log(`528 centavos dividido por 53 parcelas é aproximadamente ${resultado1.join(', ')} centavos por parcela.`);

  // let resultado2 = dividirCentavos(300, 7);
  // console.log(`300 centavos dividido por 7 parcelas é aproximadamente ${resultado2.join(', ')} centavos por parcela.`);



  async function create() {

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

      // title,tel,  nota ,  valor,  pago,  date,  pinned, cor,  valorParcial
      const response = await notasDatabase.create({
        title,
        tel,
        nota,
        valor,
        pago,
        date: formattedDate,
        pinned: Number(pinned),
        cor: cor,
        valorParcial,
        valorRestante,
        corTexto,
        parcela
      }).then((result: any) => {
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
          Linking.openURL(whatsappLink);
   
        }

        setId("")
        setTitle("")
        setTel("")
        setNota("")
        setValor("")
        setPago("Sim");
        setDate("")
        setPinned(0)
        setCor("")
        setValorParcial("")
        setCorTexto('')
        setParcela(1) 
        
        return onOpen(4);

      }).catch((err) => {
        
      });
      
    } catch (error) {
      console.log(error)
    }
  }

  async function list() {
    try {
      const response = await notasDatabase.searchByName(search)
      setNotas(response)
    } catch (error) {
      console.log(error)
    }
  }

  function details(item: NotasDatabase) {
    setId(String(item.id))
    setTitle(item.title)
    setNota(item.nota)
    setValor(item.valor)
    setPago(item.pago as PagoType)
    setDate(item.date)
    setPinned(item.pinned)
    setCor(item.cor)
    setValorParcial(item.valorParcial)
  }

  async function handleSave() {
    create()
    await list()
  }

  useEffect(() => {
    list()
  }, [search, pinned])

  useEffect(() => {
    console.log(enviarWhats)
  }, [enviarWhats])

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
  const background = colorScheme ? '#ffffff88' : '#11111111'

  return (
    <TouchableWithoutFeedback style={{ flex: 1, backgroundColor: '#000' }} onPress={handleShowToast}>
      <>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={[styles.text, styles.textSublinhado]}> Escreva sua Anotação: </Text>
          <TextInput
            placeholder='Nome'
            cursorColor={"#4e139c"}
            underlineColorAndroid="#4e139c"
            onChangeText={setTitle}
            value={title}
            style={[styles.input, { backgroundColor: background }]} />

          <MaskedTextInput
            placeholder="Telefone no formato ddd-xxxxxxxxx"
            cursorColor={"#4e139c"}
            underlineColorAndroid="#4e139c"
            inputMode="numeric"
            mask="999-999999999"
            keyboardType="numeric"
            onChangeText={(text, rawText) => {
              setTel(rawText)
            }}
            value={tel}
            style={[styles.input, { backgroundColor: background }]} />

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'nowrap',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 10,
              paddingRight: 20,
              borderColor: colorScheme ? '#fff' : "#000",
              borderRadius: 3,
              borderWidth: 1,
              backgroundColor: 'transparent'
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
            placeholder='Nota'
            cursorColor={"#4e139c"}
            // underlineColorAndroid="#4e139c"
            onChangeText={setNota}
            multiline={true}
            value={nota}
            style={[styles.input, { backgroundColor: background }]} />


          <MaskedTextInput
            placeholder="Valor da Compra"
            cursorColor={"#4e139c"}
            underlineColorAndroid="#4e139c"
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

          <RadioGroup 
          title="Pago?" 
          initialSelectedOption={pago} 
          onChange={(selectedOption: string) => setPago(selectedOption as PagoType)}
          options={options} />


          {pago === 'Parcial' && (
            <MaskedTextInput
              type="currency"
              options={{
                prefix: 'R$',
                decimalSeparator: ',',
                groupSeparator: '.',
                precision: 2
              }}
              cursorColor={"#4e139c"}
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
            onOpen={(cor, index) => { setCor(cor) }}
            onOpenText={(cor, index) => { setCorTexto(cor) }}
            corT={""}
            cor={""} />

          <TouchableOpacity
            onPress={handleSave}
            style={[styles.button,
            {
              marginBottom: 80
            }
            ]}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>

          {
// Botões personalizados para testes do Toast Personalizado
/* 
        <ButtonToast
          type="success"
          text="Success"
          onPress={() => { setToastType('success'); handleShowToast(); }}
        />
        <ButtonToast
          type="danger"
          text="Danger"
          onPress={() => { setToastType('danger'); handleShowToast(); }}
        />
        <ButtonToast
          type="info"
          text="Info"
          onPress={() => { setToastType('info'); handleShowToast(); }}
        />
        <ButtonToast
          type="warning"
          text="Warning"
          onPress={() => { setToastType('warning'); handleShowToast(); }}
        /> */}
          {/* <ModalInfo dados={mensagem} /> */}
        </ScrollView>
        <ToastMessage
          type={mensagem.tipo}
          text={mensagem.title}
          description={mensagem.message}
          ref={toastRef}
          timeout={mensagem.duration}
        />
      </>
    </ TouchableWithoutFeedback>

  )
}
