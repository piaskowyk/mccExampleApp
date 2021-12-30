# mccExampleApp

https://gerodigital.pt/wp-content/uploads/2020/08/file_example_MP4_1920_18MG.mp4

```console
adb push file_example_MP4_1920_18MG.mp4 /sdcard/file_example_MP4_1920_18MG.mp4
```

Fixes "Could not connect to development server":

```console
adb reverse tcp:8081 tcp:8081
```

Make sure to measure execution time in release build:

```console
yarn react-native run-android --variant=release
```
