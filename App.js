import { useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Alert,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import QRCode from "react-native-qrcode-svg";
import domtoimage from "dom-to-image";

import * as MediaLibrary from "expo-media-library";

export default function App() {
  const imageRef = useRef();
  const [status, requestPermission] = MediaLibrary.usePermissions();

  const [inputText, setInputText] = useState(null);
  const [qrValue, setQrValue] = useState(null);

  const [chosenColorOption, setChosenColorOption] = useState('white');
  const [chosenBackgroundOption, setChosenBackgroundOption] = useState('transparent');

  const colorOptions = ["Preto", "Branco"];
  const backgroundOptions = ["Preto", "Branco", "Transparente"];

  const colorTranslation = {
    "Preto"  : "black",
    "Branco" : "white",
  };

  const backgroundTranslation = {
    "Preto"         : "black",
    "Branco"        : "white",
    "Transparente"  : "transparent",
  };

  const onResetQRValue = () => {
    setQrValue(null);
    setInputText(null);
    if (Platform.OS === "ios" || Platform.OS === "android") {
      //Alert.alert("Sucesso!", "Dados resetados com sucesso.", [{ text: "OK" }]);
      Keyboard.dismiss();
    } else {
      setInputText('');
      //alert("Dados resetados com sucesso.");
      Keyboard.dismiss();
    }
  };

  const generateQRCode = () => {
    if (inputText == null) {
      if (Platform.OS === "ios" || Platform.OS === "android") {
        Alert.alert("Atenção!", "Preencha o campo corretamente!", [
          { text: "OK" },
        ]);
        Keyboard.dismiss();
      } else {
        alert("Preencha o campo corretamente!");
        Keyboard.dismiss();
      }
    } else {
      setQrValue(inputText);
      Keyboard.dismiss();
      if (Platform.OS === "ios" || Platform.OS === "android") {
        /*Alert.alert("Sucesso!", "Seu QR Code foi gerado com sucesso!", [
          { text: "OK" },
        ]);*/
        Keyboard.dismiss();
      } else {
        //alert("Seu QR Code foi gerado com sucesso!");
        Keyboard.dismiss();
      }
    }
  };

  const onSaveImageAsync = async () => {
    if (Platform.OS !== "web") {
      try {
        const localUri = await captureRef(imageRef, {
          height: 250,
          quality: 1,
        });

        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          if (Platform.OS === "ios" || Platform.OS === "android") {
            Alert.alert("Sucesso!", "QR Code salvo na sua galeria!", [
              { text: "OK" },
            ]);
            Keyboard.dismiss();
          } else {
            alert("QR Code salvo na sua galeria!");
            Keyboard.dismiss();
          }
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        if(chosenBackgroundOption === 'transparent'){
          const dataUrl = await domtoimage.toPng(imageRef.current, {
            quality: 0.95,
            width: 250,
            height: 250,
          });

          let link = document.createElement("a");
          link.download = "qr-code.png";
          link.href = dataUrl;
          link.click();
        } else {
          const dataUrl = await domtoimage.toJpeg(imageRef.current, {
            quality: 0.95,
            width: 250,
            height: 250,
          });
  
          let link = document.createElement("a");
          link.download = "qr-code.jpeg";
          link.href = dataUrl;
          link.click();
        }        
      } catch (e) {
        console.log(e);
      }
    }
  };

  if (status === null) {
    requestPermission();
  }

  return (
    <KeyboardAvoidingView
      style={styles.safeAreaView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      {qrValue ? (
        <View style={styles.containerQr}>
          <Text style={styles.title}>Seu QR Code:</Text>
          <View ref={imageRef} collapsable={false}>
            <QRCode
              value={qrValue}
              size={250}
              color={chosenColorOption}
              backgroundColor={chosenBackgroundOption}
              logoSize={30}
              logoBorderRadius={15}              
            />
          </View>
        </View>
      ) : (
        ""
      )}

      {qrValue ? (
        <View
          style={[
            styles.buttonContainer,
            {
              borderWidth: 3,
              borderColor: "#464646",
              borderRadius: 18,
              marginTop: 30,
            },
          ]}
        >
          <Pressable
            style={[styles.button, { backgroundColor: "#464646" }]}
            onPress={onSaveImageAsync}
          >
            <FontAwesome
              name="save"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonLabel}>Salvar QR Code</Text>
          </Pressable>
        </View>
      ) : (
        ""
      )}

      <View style={styles.container}>
        {qrValue ? (
          <View>            
          </View>
        ) : (
          <View>
            <Text style={[styles.title, { textAlign: "center" }]}>
              Escolha a cor do QR Code:
            </Text>
            <View style={styles.radioButtonContainer}>
              {colorOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.radioButton,
                    {
                      borderColor:
                        chosenColorOption === colorTranslation[option] ? "gray" : "#2c2c2c",
                    },                    
                  ]}
                  onPress={() => setChosenColorOption(colorTranslation[option])}
                >
                  <Text style={{ color: "#fff" }}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.title, { textAlign: "center" }]}>
              Escolha a cor de fundo do QR Code:
            </Text>
            <View style={styles.radioButtonContainer}>
              {backgroundOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.radioButton,
                    {
                      borderColor:
                        chosenBackgroundOption === backgroundTranslation[option] ? "gray" : "#2c2c2c",
                    },
                  ]}
                  onPress={() => setChosenBackgroundOption(backgroundTranslation[option])}
                >
                  <Text style={{ color: "#fff" }}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.text}>Insira seu texto e/ou URL:</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(inputText) => setInputText(inputText)}
          value={inputText}
          placeholder="Preencha com seu texto e/ou endereço de link"
          placeholderTextColor="#fff"
          onFocus={() => {
            setQrValue(null);
            setInputText(null);
          }}
        />

        <View
          style={[
            styles.buttonContainer,
            { borderWidth: 3, borderColor: "#464646", borderRadius: 18 },
          ]}
        >
          <Pressable
            style={[styles.button, { backgroundColor: "#464646" }]}
            onPress={() => generateQRCode(inputText)}
          >
            <FontAwesome
              name="qrcode"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonLabel}>Gerar QR Code</Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.buttonContainer,
            { borderWidth: 3, borderColor: "#464646", borderRadius: 18 },
          ]}
        >
          <Pressable
            style={[styles.button, { backgroundColor: "#464646" }]}
            onPress={() => onResetQRValue()}
          >
            <FontAwesome
              name="repeat"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonLabel}>Resetar QR Code</Text>
          </Pressable>
        </View>        
        <Text style={{ textAlign: 'center', marginTop: 5, color: 'white', fontSize: 12 }}><FontAwesome name="github" color="#fff" size={12}/> feito por Dev Wee (Igor)</Text>
      </View>      
      <StatusBar style="light" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "#2C2C2C",
  },
  title: {
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 18,
  },
  containerQr: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    margin: 5,
    color: "#fff",
  },
  textInput: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 25,
    margin: 10,
    borderWidth: 1,
    borderColor: "#fff",
    color: "#fff",
    padding: 7,
    fontSize: 20,
    borderRadius: 20,
    height: 60,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 320,
    height: 68,
    marginHorizontal: 50,
    padding: 4,
    margin: 5,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 10,
    width: "100%",
    height: "100%",
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    fontSize: 16,
    color: "#fff",
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButton: {
    marginRight: 10,
    marginBottom: 25,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
  },
});
