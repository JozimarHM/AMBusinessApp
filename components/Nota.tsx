import { Pressable, PressableProps, Text, TouchableOpacity } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import CustomCard from "./customcard"
import { router } from "expo-router"

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

export function Nota({ data, onDelete, onOpen,onLongPressOpen, ...rest }: Props) {
  return (
    <Pressable
    onLongPress={onLongPressOpen}
      style={{
        backgroundColor: "#fff",
        padding: 4,
        borderRadius: 5,
        gap: 12,
        flexDirection: "row",
        elevation: 0
      }}
      {...rest}
    >
      
      <CustomCard
        data={data} 
        onDelete={onDelete} 
        onOpen={onOpen}
         onLongPressOpen={onLongPressOpen} />
    </Pressable>
  )
}
