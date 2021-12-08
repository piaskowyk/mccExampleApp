import React from 'react';
import type {Node} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {
  shouldSendData,
  PrivacyLevel,
  ConnectionType,
  SignalStrenght,
  ConnectionSpeed,
} from './src/ShouldSendData';
import MlkitOcr from 'react-native-mlkit-ocr'; // https://www.npmjs.com/package/react-native-mlkit-ocr
import {Button} from 'react-native-paper';
import ImgToBase64 from 'react-native-image-base64';

const App: () => Node = () => {
  const shouldSend = shouldSendData({
    privacyLevel: PrivacyLevel.NORMAL,
    baterryLevel: 0.68,
    signalStrenght: SignalStrenght.NORMAL,
    connectionType: ConnectionType.WIFI,
    connectionSpeed: ConnectionSpeed.FAST,
    dataSize: 1000,
  });

  const ocrImageOnDeviceFromUri = async uri => {
    let startDate = new Date();
    const result = await MlkitOcr.detectFromUri(uri);
    let endDate = new Date();
    console.log(
      `OCR On-device took ${endDate.getTime() - startDate.getTime()}`,
    );
    return result;
  };

  const ocrImageInCloudFromUri = async uri => {
    const base64image = await ImgToBase64.getBase64String(uri);
    const json = {
      requests: [
        {
          image: {
            content: base64image,
          },
          features: [
            {
              type: 'TEXT_DETECTION',
            },
          ],
        },
      ],
    };

    let startDate = new Date();
    const result = (
      await fetch('https://vision.googleapis.com/v1/images:annotate', {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization:
            'Bearer ya29.c.b0AXv0zTNzAT0YgJwF30G5PKKBpH0-FICracxTirMN9H5xo43K5JIYm-xyh8qtCdfZiMiY2i3-dZ7QU37vWjw8mFWGrVn5AcVEhFrZbXCTrH6kA4S6jN_LMUGzXaGHYTJEV5ZYmLMxdlkTlaVfvd-TMULRwunzL8wEzCn4E1YquucF5U7upgRzqPl9jq2jcMk7Whk7nWiXZBx75K4LUAKGqTOZUxwWxoQ',
        },
      })
    );
    let endDate = new Date();
    console.log(`OCR On-cloud took ${endDate.getTime() - startDate.getTime()}`);
    return result;
  };

  const chooseImage = () => {
    launchImageLibrary(null, async e => {
      const fileUri = e['assets'][0]['uri'];
      console.log(`You have chosen ${fileUri}`);
      ocrImageOnDeviceFromUri(fileUri);
      ocrImageInCloudFromUri(fileUri);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Najlepszy OCR</Text>
      <Button onPress={chooseImage}>Wybierz obrazek</Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  text: {
    color: '#000',
  },
});

export default App;
