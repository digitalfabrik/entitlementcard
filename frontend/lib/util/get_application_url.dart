import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/configuration/definitions.dart';
import 'package:ehrenamtskarte/identification/util/card_info_utils.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';

String getApplicationUrl(ApplicationUrl applicationUrl, bool isStagingEnabled) {
  return isStagingEnabled
      ? applicationUrl.staging
      : isProduction()
          ? applicationUrl.production
          : applicationUrl.local;
}

String getApplicationUrlWithParameters(String applicationUrl, CardInfo cardInfo, String? applicationUrlQueryKeyName,
    String? applicationUrlQueryKeyBirthday, String? applicationUrlQueryKeyReferenceNumber) {
  if (applicationUrlQueryKeyName == null ||
      applicationUrlQueryKeyBirthday == null ||
      applicationUrlQueryKeyReferenceNumber == null) {
    return applicationUrl;
  }

  final parsedApplicationUrl = Uri.parse(applicationUrl);
  return Uri(
      scheme: parsedApplicationUrl.scheme,
      host: parsedApplicationUrl.host,
      port: parsedApplicationUrl.port,
      path: parsedApplicationUrl.path,
      queryParameters: {
        applicationUrlQueryKeyName: cardInfo.fullName,
        applicationUrlQueryKeyBirthday: getFormattedBirthday(cardInfo),
        applicationUrlQueryKeyReferenceNumber: cardInfo.extensions.hasExtensionKoblenzReferenceNumber()
            ? cardInfo.extensions.extensionKoblenzReferenceNumber.referenceNumber
            : null
      }).toString();
}
