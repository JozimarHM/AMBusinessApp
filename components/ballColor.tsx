import { Pressable, PressableProps, Text, TouchableOpacity, useColorScheme, View } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import CustomCard from "./customcard"
import { router } from "expo-router"
import { Icon } from "react-native-paper"
import { useState } from "react"

type Props = PressableProps & {
  data: {
    key: string
    checked: boolean
  }
  // onDelete: () => void
  onOpen: () => void
  // onLongPressOpen: () => void
}

export function BallColor({ data, onOpen, ...rest }: Props) {
  const useColor = useColorScheme() === 'dark';
  const [icon, setIcon] = useState(false)
  function Greeting(props: boolean) {

    if (data.checked) {
      return <Icon size={20} color="#000" source={'check'} />;
    }
    return <Icon size={0} source={'check'} />;
  }
  return (
    <Pressable
      onPress={onOpen}
      style={{
        backgroundColor: data.key,
        width: 50,
        height: 50,
        padding: 4,
        borderRadius: 5,
        gap: 12,
        justifyContent: "center",
        alignItems: 'center',
        borderWidth: 1,
        borderColor: useColor?'#fff' : '#000'
    
      }}
      {...rest}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          borderTopLeftRadius: 5,
          borderBottomRightRadius: 5,
          position: 'absolute',
          top: 0,
          left: 0,
        }}>
        {Greeting(icon)}
      </View>

    </Pressable>
  )
}
