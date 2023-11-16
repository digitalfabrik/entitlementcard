import 'dart:io';
import 'package:flutter/services.dart';
import 'package:device_info_plus/device_info_plus.dart';

Future<void> loadCertificate() async {
  ByteData? data = await PlatformAssetBundle().load('assets/ca/lets-encrypt-r3.pem');
  SecurityContext.defaultContext.setTrustedCertificatesBytes(data.buffer.asUint8List());
}

Future<bool> certificateIsRequired() async {
  DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();
  AndroidDeviceInfo androidInfo = await deviceInfo.androidInfo;
  return androidInfo.version.sdkInt < 25;
}
