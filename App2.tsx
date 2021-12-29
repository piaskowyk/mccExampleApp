import {Button, PermissionsAndroid, View} from 'react-native';

import {RNFFmpeg} from 'react-native-ffmpeg';
import React from 'react';

const {READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE} =
  PermissionsAndroid.PERMISSIONS;

const params = [
  '-y', // overwrite output file
  '-i',
  '/sdcard/file_example_MP4_1920_18MG.mp4',
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

async function run() {
  if (!(await grantPermissions())) return;

  const start = performance.now();
  const result = await RNFFmpeg.executeWithArguments(params);
  const end = performance.now();

  console.log(`FFmpeg process exited with rc=${result}.`);
  if (result) return;

  const seconds = ((end - start) / 1000).toFixed(3);
  console.log(`${seconds} seconds`);
}

export default function App2() {
  const handleClick = () => {
    run();
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button onPress={handleClick} title="Run ffmpeg" />
    </View>
  );
}
