import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/configuration/definitions.dart';
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/identification/util/card_info_utils.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

String getApplicationUrl(BuildContext context) {
  final isStagingEnabled = Provider.of<SettingsModel>(context, listen: false).enableStaging;
  final applicationUrl = buildConfig.applicationUrl;
  if (isStagingEnabled) {
    return applicationUrl.staging;
  }
  return isProduction() ? applicationUrl.production : applicationUrl.local;
}

String getApplicationUrlForCardExtension(String applicationUrl, CardInfo cardInfo, String? applicationQueryKeyName,
    String? applicationQueryKeyBirthday, String? applicationQueryKeyReferenceNumber) {
  if (applicationQueryKeyName != null &&
      applicationQueryKeyBirthday != null &&
      applicationQueryKeyReferenceNumber != null) {
    final parsedUrl = Uri.parse(applicationUrl);
    final queryParams = {
      applicationQueryKeyName: cardInfo.fullName,
      applicationQueryKeyBirthday: getFormattedBirthday(cardInfo),
      applicationQueryKeyReferenceNumber: cardInfo.extensions.hasExtensionKoblenzReferenceNumber()
          ? cardInfo.extensions.extensionKoblenzReferenceNumber.referenceNumber
          : null,
    };
    return parsedUrl.replace(queryParameters: queryParams).toString();
  }
  return applicationUrl;
}
