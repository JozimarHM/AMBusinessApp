import { Button, StyleSheet, TextInput } from "react-native";
import { Text, View } from "@/components/Themed";
import { router } from "expo-router";
import { setItemAsync } from "expo-secure-store";
import BiometricAuth from "@/components/BiometricAuth";

export default function Login() {

  return (
  <BiometricAuth />
    // <View style={styles.container}>
    //   <Text style={styles.title}>Bem Vindo! 🌈 </Text>
    //   <Text style={styles.paragraph}>
    //     Deseja usar a Digital para entradas futuras?
    //   </Text>
    //   <View style={{flexDirection: 'row', gap:50}}>
    //     <Button title="Sim" onPress={undefined} />
    //     <Button title="Não" onPress={undefined} />
    //   </View>
    //   <View
    //     style={styles.separator}
    //     lightColor="#eee"
    //     darkColor="rgba(255,255,255,0.1)"
    //   />
    //   {/* <TextInput placeholder="Username(not required)" style={styles.input} />
    //   <TextInput
    //     placeholder="Password(not required)"
    //     secureTextEntry
    //     style={styles.input}
    //   /> */}
     

    //   {/* <Button title="Login" onPress={handleLogin} /> */}
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: "center",
  },

  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    margin: 10,
    borderRadius: 4,
  },
});