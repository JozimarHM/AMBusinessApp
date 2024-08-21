import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 12,
    gap: 16,
  },
  containerSetting: {
    flex: 1,
    justifyContent: "center",
    padding: 1,
    gap: 16,
  },
  scrollContainer: {
    padding: 10,
    flexGrow: 1,
    gap: 10,
    alignItems: 'center'
  },
  text: {
    fontSize: 20
  },
  textSublinhado: {
    letterSpacing: 3,
    fontWeight: 'condensedBold'
  },
  flatlist: {
    flexGrow: 0
  },
  viewBtnModal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 50,
  },
  btnModal: {
    columnGap: 10,
    textShadowColor: '#fff',
    rowGap: 10,
    flexDirection: 'row-reverse',
    backgroundColor: '#005fff',
    borderRadius: 5,
    width: 150,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    minHeight: 40
  },
  TextWhite: {
    color: '#fff',
    fontSize: 20
  },
  TextDark: {
    color: '#000',
    fontSize: 20
  },
  textTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 34
  },
  nota: {
    flex: 1,
    justifyContent: "center",
    padding: 2,
    gap: 8
  },
  margem10: {
    margin: 10
  },
  margem20: {
    margin: 20
  },
  margem30: {
    margin: 30
  },
  margem40: {
    margin: 40
  },
  margem50: {
    margin: 50
  },
  input: {
    width: '100%',
    height: 60,
    paddingStart: 10,
    fontSize: 17,
    margin: 1,
    backgroundColor: '#11111111',
    borderRadius: 3,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5
  },
  maskedText: {
    color: '#FFF',
    flex: 1,
    textAlign: 'right'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  switchContainer: {
    transform: [{ scaleX: 1 }, { scaleY: 1 }] // Altere os valores de scaleX e scaleY para ajustar o tamanho
  },
  list: {
    flexGrow: 1,
  },
  listFillScreen: {
    justifyContent: 'center',
  },
  item: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  button: {
    backgroundColor: '#6200ea', // Fundo roxo
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Sombras para Android
    shadowColor: '#000', // Sombras para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#ffffff', // Texto branco
    fontSize: 16,
    fontWeight: 'bold',
  },
  appButtonContainer: {
    elevation: 8,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal:35
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  button_Native: {
    backgroundColor: '#620f2E',
    width: 150,
    borderRadius: 15,
  },
  buttonText_Native: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
})

export default styles