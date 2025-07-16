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

Future<bool> isDeviceWithCameraIssues() async {
  if (!Platform.isAndroid) {
    return false;
  }
  // All models of Galaxy A23
  List<String> devicesWithoutQRCodeDetection = [
    'SM-A235F',
    'SM-A235M',
    'SM-A235N',
    'SM-A233C',
    'SM-A2360',
    'SM-A236B',
    'SM-A236E',
    'SM-A236M',
    'SM-A236U',
    'SM-A236U1',
    'SM-S236DL',
    'SM-S237VL',
    'SM-A236V',
  ];
  DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();
  AndroidDeviceInfo androidInfo = await deviceInfo.androidInfo;
  return devicesWithoutQRCodeDetection.contains(androidInfo.model);
}
