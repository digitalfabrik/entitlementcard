import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/configuration/definitions.dart';
import 'package:ehrenamtskarte/identification/util/card_info_utils.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';

String getApplicationUrl(BuildConfig buildConfig, bool isStagingEnabled) {
  return isStagingEnabled
      ? buildConfig.applicationUrl.staging
      : isProduction()
          ? buildConfig.applicationUrl.production
          : buildConfig.applicationUrl.local;
}

String getApplicationUrlWithParameters(String applicationUrl, CardInfo cardInfo, BuildConfig buildConfig) {
  // ignore: unnecessary_null_comparison
  if (buildConfig.applicationUrlQueryKeyName == null ||
      // ignore: unnecessary_null_comparison
      buildConfig.applicationUrlQueryKeyBirthday == null ||
      // ignore: unnecessary_null_comparison
      buildConfig.applicationUrlQueryKeyReferenceNumber == null) {
    return applicationUrl;
  }

  final parsedApplicationUrl = Uri.parse(applicationUrl);
  return Uri(
      scheme: parsedApplicationUrl.scheme,
      host: parsedApplicationUrl.host,
      port: parsedApplicationUrl.port,
      path: parsedApplicationUrl.path,
      // assume keys are set, since they were checked above
      queryParameters: {
        buildConfig.applicationUrlQueryKeyName!: cardInfo.fullName,
        buildConfig.applicationUrlQueryKeyBirthday!: getFormattedBirthday(cardInfo),
        buildConfig.applicationUrlQueryKeyReferenceNumber!: cardInfo.extensions.hasExtensionKoblenzReferenceNumber()
            ? cardInfo.extensions.extensionKoblenzReferenceNumber.referenceNumber
            : null
      }).toString();
}
