import { useState } from "react";
import { StatusBar, setStatusBarBackgroundColor } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function App() {

  const [inputText, setInputText] = useState(null);
  const [qrValue, setQrValue] = useState(null);

  return (
    <View style={styles.container}>
      <Text >Open up App.js to start working on your app!</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#964B00',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
