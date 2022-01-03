import React from 'react';
import {Button, PermissionsAndroid, Platform, Text, View} from 'react-native';
import RNFS from 'react-native-fs';
import {launchImageLibrary} from 'react-native-image-picker';
import CameraRoll from '@react-native-community/cameraroll';
import {RNFFmpeg, RNFFprobe} from 'react-native-ffmpeg';

const {READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE} =
  PermissionsAndroid.PERMISSIONS;

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

    const selectedVideo = await launchImageLibrary({
      mediaType: 'video',
      selectionLimit: 1,
    });
    var selectedVideoUri = selectedVideo.assets[0].uri;

    if (Platform.OS == 'android') {
      if (!(await grantPermissions())) {
        setText('Permission denied');
        return;
      }
      await RNFS.copyFile(
        selectedVideoUri,
        RNFS.CachesDirectoryPath + '/input.mp4',
      );
      selectedVideoUri = RNFS.CachesDirectoryPath + '/input.mp4';
    }

    const start = performance.now();
    const probeResult = await RNFFprobe.getMediaInformation(selectedVideoUri);
    const duration = Number(probeResult.getMediaProperties()['duration']);
    const targetSize = 7 * 1000 * 1000 * 8; // 8 MB in bits (for some reason it can exceed 8 MB so I chose 7 MB)
    const ceilDuration = Math.ceil(duration);
    const totalBitrate = Math.round(targetSize / ceilDuration);
    const audioBitrate = 128 * 1000;
    const videoBitrate = totalBitrate - audioBitrate;

    const ffmpegParams = [
      '-y',
      '-i',
      selectedVideoUri,
      '-b:v',
      videoBitrate.toString(),
      '-maxrate',
      videoBitrate.toString(),
      '-b:a',
      audioBitrate.toString(),
      '-c:v',
      'libx264',
      '-rc-lookahead',
      '6',
      '-c:a',
      'aac',
      '-pix_fmt',
      'yuv420p',
      RNFS.TemporaryDirectoryPath + '/out.mp4',
    ];

    const result = await RNFFmpeg.executeWithArguments(ffmpegParams);
    const end = performance.now();

    if (result) {
      setText(`FFmpeg process exited with rc=${result}.`);
      return;
    }

    CameraRoll.save(RNFS.TemporaryDirectoryPath + '/out.mp4');

    const seconds = ((end - start) / 1000).toFixed(3);
    setText(`${seconds} seconds`);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Button onPress={handleClick} title="Run ffmpeg" />
      <Text style={{color: '#00FF00'}}>{text}</Text>
    </View>
  );
}
