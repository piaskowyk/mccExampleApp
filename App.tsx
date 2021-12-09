import React from 'react';
import type {Node} from 'react';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
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
  const [result, setResult] = React.useState('');
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
    const result = await fetch(
      'https://vision.googleapis.com/v1/images:annotate',
      {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization:
            'Bearer ya29.c.b0AXv0zTNzy7YZnVWtMVpUYMpIBRF7Vv3XuFsV3GabOUL-qUaz1741yPj_VkcGlSKe_1AFHy7KUuuras9LBgy4yM0Yq2h8SW8R7NWad_BDjlCFNlBJFgIWaWTle9aZQtO4LuSaEWJLbwBouh-pWquQACDqdgch8YWV0hUy6ZNOeiIUdy0e3FQqWMJiZRICvyekLWxDhTVFTP5hzTUriwFx4GHTBUEcKYg',
        },
      },
    );
    let endDate = new Date();
    console.log(`OCR On-cloud took ${endDate.getTime() - startDate.getTime()}`);
    return await result.json();
  };

  const ocrImage = async fileUri => {
    console.log(`You have chosen ${fileUri}`);

    const result = await ocrImageOnDeviceFromUri(fileUri);
    if (result.length > 0) {
      const textResult = result.map(e => e.text).reduce((a, b) => `${a}\n${b}`);
      setResult(textResult);
    } else {
      setResult('Brak wyników!');
    }

    const cloudResult = await ocrImageInCloudFromUri(fileUri);
    // if (cloudResult["responses"].length > 0) {
    //   const textResult = cloudResult["responses"].map(e => e["textAnnotations"]).reduce((a, b) => {console.log(a); return `${a["description"]}\n${b["description"]}`});
    //   console.log(textResult);
    //   setResult(textResult);
    // } else {
    //   setResult('Brak wyników!');
    // }
  };

  const chooseImage = () => {
    launchImageLibrary(null, async e => {
      ocrImage(e['assets'][0]['uri']);
    });
  };

  const takeImage = () => {
    launchCamera(null, async e => {
      ocrImage(e['assets'][0]['uri']);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Najlepszy OCR</Text>
      <Button onPress={chooseImage}>Wybierz obrazek z galerii</Button>
      <Button onPress={takeImage}>Zrób zdjęcie</Button>
      <Text style={styles.text}>{result}</Text>
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
