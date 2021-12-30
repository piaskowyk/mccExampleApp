import {Button, PermissionsAndroid, Text, View} from 'react-native';

import {RNFFmpeg} from 'react-native-ffmpeg';
import React from 'react';

const {READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE} =
  PermissionsAndroid.PERMISSIONS;

const params = [
  '-y', // overwrite output file
  '-i',
  '/sdcard/DCIM/file_example_MP4_1920_18MG.mp4',
  '-c:v', // TODO: use same codecs as for cloud
  'mpeg4',
  '/sdcard/DCIM/out.mp4',
];

async function grantPermissions() {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      READ_EXTERNAL_STORAGE,
      WRITE_EXTERNAL_STORAGE,
    ]);
    if (
      granted[READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
      granted[WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
    ) {
      return true;
    } else {
      console.log('Permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
  return false;
}

export default function App2() {
  const [text, setText] = React.useState('');

  const handleClick = async () => {
    setText('Work in progress...');

    if (!(await grantPermissions())) {
      setText('Permission denied');
      return;
    }

    const start = performance.now();
    console.log(params);
    // const result = await RNFFmpeg.execute(params);
    const result = await RNFFmpeg.executeWithArguments(params);
    const end = performance.now();

    if (result) {
      setText(`FFmpeg process exited with rc=${result}.`);
      return;
    }

    const seconds = ((end - start) / 1000).toFixed(3);
    setText(`${seconds} seconds`);
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button onPress={handleClick} title="Run ffmpeg" />
      <Text>{text}</Text>
    </View>
  );
}
