import React, { useState, useEffect } from "react"
import { View, Text } from "react-native"
import { useLocalSearchParams } from "expo-router"

import { useNotasDatabase } from "@/database/useNotasDatabase"


export default function Details() {

  const [notaDb, setNota] = useState({
    title: "",
    tel: "",
    nota: "",
    valor: "",
    pago: "",
    date: "",
    pinned: 0,
    cor: 0,
    valorParcial: "",
  })


  const notasDatabase = useNotasDatabase()
  const params = useLocalSearchParams<{ id: string }>()

  useEffect(() => {
    if (params.id) {
      notasDatabase.show(Number(params.id)).then((response) => {
        
        if (response) {
          
          setNota({
            title: response.title,
            tel: response.tel,
            nota: response.nota,
            valor: response.valor,
            pago: response.pago,
            date: response.date,
            pinned: response.pinned,
            cor: (Number(response.cor)),
            valorParcial: response.valorParcial,
          })        
        }
      })
    }
  }, [params.id])

  return (
    <View style={{ flex: 1, justifyContent: "center",  }}>
      <Text style={{ fontSize: 32 }}>ID: {params.id} </Text>

      <Text style={{ fontSize: 25, }}>Nome: {notaDb.title}</Text>
      <Text style={{ fontSize: 25, width: "auto"}}>Telefone: {notaDb.tel}</Text>
      <Text style={{ fontSize: 25, }}>Nota: {notaDb.nota}</Text>
      <Text style={{ fontSize: 25, }}>Valor: {notaDb.valor}</Text>
      <Text style={{ fontSize: 25, }}>Pago?: {notaDb.pago}</Text>
      <Text style={{ fontSize: 25, }}>data: {notaDb.date}</Text>
      <Text style={{ fontSize: 25, }}>pinned: {notaDb.pinned}</Text>
      <Text style={{ fontSize: 25, }}>Valor Parcial: {notaDb.valorParcial}</Text>
    </View>
  )
}
