import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { 
  shouldSendData, 
  PrivacyLevel, 
  ConnectionType, 
  SignalStrenght, 
  ConnectionSpeed 
} from './src/ShouldSendData';
import MlkitOcr from 'react-native-mlkit-ocr'; // https://www.npmjs.com/package/react-native-mlkit-ocr

const App: () => Node = () => {
  const shouldSend = shouldSendData({
    privacyLevel: PrivacyLevel.NORMAL,
    baterryLevel: 0.68,
    signalStrenght: SignalStrenght.NORMAL,
    connectionType: ConnectionType.WIFI,
    connectionSpeed: ConnectionSpeed.FAST,
    dataSize: 1000
  });

  const resultFromUri = (async () => {
    const ocrResult = await MlkitOcr.detectFromUri("https://jeroen.github.io/images/testocr.png")
    console.log(ocrResult[0].text)
  })();
  // const resultFromFile = await MlkitOcr.detectFromFile(path);

  return (
    <SafeAreaView>
      <Text>Result: {shouldSend ? "YES" : "NO"}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  
});

export default App;
