// importações Padrão
import React, { useEffect, useState } from "react"
import { Dimensions, FlatList, RefreshControl, Vibration, useColorScheme } from "react-native"
import { router, useFocusEffect } from "expo-router"
//importação de bibliotecas de terceiros para o conjunto Modal
import { useModalize } from "react-native-modalize"
// importações de componentes personalizados
import { Input } from "@/components/Input"
import { Nota } from "@/components/Nota"
//importação da estrutura do Database e métodos 
import { NotasDatabase, useNotasDatabase } from "@/database/useNotasDatabase"
import DeleteModal from "@/components/DeleteModal"
import styles from "@/constants/Styles"
import { useAsyncStorage } from "@react-native-async-storage/async-storage"
import { usePreferences } from "@/context/PreferencesContext"
import { backupDatabase } from "@/context/useDatabaseBackup"
// import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";
import { View } from "@/components/Themed"


const db = SQLite.openDatabaseSync("notas.db");

export default function Home() {
  // useDrizzleStudio(db);
  const
    { darkModeEnabled, biometricEnabled, updateDarkMode, updateBiometrics, loading } = usePreferences();
  // title,  nota ,  valor,  pago,  date,  pinned, cor,  valorParcial

  const { height } = Dimensions.get('window');
  const tema = useColorScheme()
  const [id, setId] = useState(0)
  const [search, setSearch] = useState("")
  const [typeSearch, setTypeSearch] = useState("")
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
  const [parcela, setParcela] = useState("")
  const [notas, setNotas] = useState<NotasDatabase[]>([])
  const [idDelete, setIdDelete] = useState(0)
  const notasDatabase = useNotasDatabase()
  const { ref, open, close } = useModalize();
  const [value, setValue] = useState('value' as String | null);
  const [biometric, setValue2] = useState(false);
  const { getItem, setItem } = useAsyncStorage('@storage_key');
  const [refreshing, setRefreshing] = useState(false); // Estado para controlar o pull-to-refresh


  const onOpen = (id: number) => {
    setIdDelete(id)
    ref.current?.open();
  };


  async function updatePin(idUpdate: number, pinnedUpdate: number) {
    try {
      const response = await notasDatabase.updatePin({
        id: idUpdate,
        pinned: pinnedUpdate
      }).then(() => {
        list()
      })

    } catch (error) {
      console.log(error)
    }
  }

  async function list() {
    try {
      const response = await notasDatabase.searchByName(search)
      setNotas(response || []); // Garantindo que o response seja um array
    } catch (error) {
      console.log(error)
    }
  }

  async function remove(id: number) {

    try {
      await notasDatabase.remove(id)
      ref.current?.close()
      await list()
    } catch (error) {
      console.log(error)
    }
  }

  function details(item: NotasDatabase) {
    setId(item.id)
    setTitle(item.title)
    setNota(item.nota)
    setValor(item.valor)
    setPago(item.pago)
    setDate(item.date)
    setPinned(item.pinned)
    setCor(item.cor)
    setValorParcial(item.valorParcial)
  }


  const readItemFromStorage = async () => {
    const item = await getItem();
    setValue(item);
  };

  useEffect(() => {
    list()
  }, [search])

  useFocusEffect(
    React.useCallback(() => {
      list()
      readItemFromStorage();
      backupDatabase();
    }, [])
  );

  useEffect(() => {
    // SplashScreen.hideAsync()
    // Define o listener para alterações no banco de dados
    const listener = (change: any) => {
      console.log('Database change detected:', change);
      list()
      // Atualize a UI ou execute outras ações conforme necessário
    };

    // Adiciona o listener para alterações no banco de dados
    const subscription = SQLite.addDatabaseChangeListener(listener);

    // Limpa o listener quando o componente é desmontado
    return () => {
      subscription.remove();
    };
  }, []); // Lista de dependências vazia, o efeito é executado apenas uma vez

  const handleRefresh = async () => {
    setRefreshing(true);
    await list();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 2, gap: 8 }}>

      <Input placeholder="Pesquisar" placeholderTextColor={tema === 'dark' ? '#fff' : '#000'} onChangeText={setSearch} />

      <FlatList
        data={notas}
        extraData={notas}
        horizontal={false}
        keyExtractor={(item) => String(item.id)}

        renderItem={({ item }) => (
          <Nota
            style={styles.nota}
            data={item}
            // onPress={() => details(item)}
            onDelete={() => onOpen(item.id)}
            onLongPressOpen={() => {
              let idA = item.id
              let pinU: number

              if (item.pinned > 0) {
                pinU = 0
              } else {
                pinU = 1
              }
              updatePin(idA, pinU)
              Vibration.vibrate(100)
            }
            }
            // onLongPressOpen={() => router.navigate("/details/" + item.id)}
            onOpen={() => router.navigate(`./update/${item.id}`)}
          />
        )}
        contentContainerStyle={[styles.list, notas?.length * 50 < height && styles.listFillScreen, , { gap: 8 }]}
        ListFooterComponent={<View style={{ height: 70 }} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }      
      
      />
      <DeleteModal dados={{
        modalizeRef: ref,
        id: idDelete
      }}
        onDelete={() => { remove(idDelete) }}
        onCancel={() => ref.current?.close()} />
    </View >
  )
}