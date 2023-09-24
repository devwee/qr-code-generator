import { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View, TextInput, Pressable, KeyboardAvoidingView, Alert, Keyboard } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import QRCode from 'react-native-qrcode-svg';

export default function App() {

  const [inputText, setInputText] = useState(null);
  const [qrValue, setQrValue] = useState(null);

  const onResetQRValue = () =>{
    setQrValue(null);
    setInputText(null);
    if (Platform.OS === "ios") {
      Alert.alert('Sucesso!', 'Dados resetados com sucesso.', [
        {text: 'OK'}
      ]);
      Keyboard.dismiss();
    } else {
      alert('Dados resetados com sucesso.');
      Keyboard.dismiss();
    }
  };

  const generateQRCode = () => {
    if (inputText == null) {
      if (Platform.OS === "ios") {
        Alert.alert('Atenção!', 'Preencha o campo corretamente!', [
          {text: 'OK'}
        ]);
        Keyboard.dismiss();
      } else {
        alert('Preencha o campo corretamente!');
        Keyboard.dismiss();
      }
    } else {
      setQrValue(inputText);
      Keyboard.dismiss();
      if (Platform.OS === "ios") {
        Alert.alert('Sucesso!', 'Seu QR Code foi gerado com sucesso!', [
          {text: 'OK'}
        ]);
        Keyboard.dismiss();
      } else {
        alert('Seu QR Code foi gerado com sucesso!');
        Keyboard.dismiss();
      }
    }
  }

  return (
    <KeyboardAvoidingView 
        style={styles.safeAreaView} 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >

      <View style={styles.containerQr}>
        { qrValue ? <Text style={styles.title}>Seu QR Code:</Text> : '' }
        {qrValue ? 
            <QRCode 
            value={qrValue}
            size={250}
            color="white"
            backgroundColor="#2C2C2C"
            logoSize={30}
            logoBorderRadius={15}
            logoBackgroundColor="#2C2C2C"/>
          : <Text style={styles.title}>Preencha o campo abaixo e gere seu QR Code.</Text>
        }
      </View>

      <View style={styles.container}>
        <Text style={styles.text}>Insira seu text e/ou URL:</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(inputText) => setInputText(inputText)}
          value={inputText}
          placeholder="Preencha com seu texto e/ou endereço de link"
          placeholderTextColor="#fff"
        />

        <View style={[styles.buttonContainer, {borderWidth: 3, borderColor: "#464646", borderRadius: 18 }]}>          
          <Pressable style={[styles.button, {backgroundColor: '#464646'}]} onPress={() => generateQRCode(inputText)}>
            <FontAwesome
              name="qrcode"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonLabel}>Gerar QR Code</Text>
          </Pressable>          
        </View>

        <View style={[styles.buttonContainer, {borderWidth: 3, borderColor: "#464646", borderRadius: 18 }]}>
          <Pressable style={[styles.button, {backgroundColor: '#464646'}]} onPress={() => onResetQRValue()}>
            <FontAwesome
              name="repeat"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonLabel}>Resetar QR Code</Text>
          </Pressable>
        </View>

      </View>
      <StatusBar style="light" />      
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#2C2C2C',    
  },  
  title: {
    marginBottom: 15,        
    alignItems: 'center',
    justifyContent: 'center',
    color:'#fff',
    fontSize: 18,
  },
  containerQr: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',    
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
    color: '#fff',
  },
  textInput: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 25,
    margin: 10,  
    borderWidth: 1,
    borderColor: '#fff',    
    color:'#fff',
    padding: 7,
    fontSize: 20,
    borderRadius: 20,
    height: 60,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width:320,
    height:68,
    marginHorizontal: 50,    
    padding: 4,
    margin:5,
  }, 
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    width: '100%',
    height: '100%',    
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    fontSize: 16,
    color:'#fff',
  },
});
