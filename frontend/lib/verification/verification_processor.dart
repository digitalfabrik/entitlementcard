import 'package:intl/intl.dart';

import '../identification/protobuf/card_activate_model.pb.dart';

import '../qr_code_scanner/qr_code_parser.dart';
import 'scanner/verification_qr_content_parser.dart';
import 'verification_card_details.dart';
import 'verification_card_details_model.dart';
import 'verification_error.dart';
import 'verification_hasher.dart';

class VerificationProcessor {
  final VerificationCardDetailsModel model;

  VerificationProcessor(this.model);

  QRCodeParseResult processQrCodeContent(String rawBase64Content) {
    VerificationCardDetails cardDetails;
    try {
      cardDetails = parseQRCodeContent(rawBase64Content);
    } on VerificationParseException catch (e) {
      print("Failed to parse qr code content. Message: ${e.internalMessage}");
      print("Stacktrace: ${e.stackTrace?.toString()}");
      return QRCodeParseResult(
          hasError: true, userErrorMessage: e.externalMessage);
    } on Exception catch (e, stacktrace) {
      print("Unexpected Error while parsing qr code content. "
          "Error message: ${e.toString()}");
      print(stacktrace);
      return QRCodeParseResult(
          hasError: true,
          userErrorMessage: "Ein unbekannter Fehler beim Einlesen des QR Codes "
              "ist aufgetreten.");
    }

    if (checkIfCardDetailsConsistent(cardDetails)) {
      final hash = hashVerificationCardDetails(cardDetails);
      model.setReadyForRemoteVerification(cardDetails, hash);
    }

    return QRCodeParseResult();
  }

  bool checkIfCardDetailsConsistent(VerificationCardDetails verCardDetails) {
    final baseCardDetails = verCardDetails.cardDetails;
    if (baseCardDetails.fullName == null || baseCardDetails.fullName.isEmpty) {
      model.setVerificationFailure(
          createFieldMissingError("fullName", "fullNameMissing"));
      return false;
    }
    if (baseCardDetails.regionId == null) {
      model.setVerificationFailure(
          createFieldMissingError("regionId", "regionIdMissing"));
      return false;
    }
    if (baseCardDetails.unixExpirationDate == null &&
        baseCardDetails.cardType == CardActivateModel_CardType.STANDARD.value) {
      model.setVerificationFailure(createFieldMissingError(
          "expirationDate", "expirationDateStandardMissing"));
      return false;
    }
    if (baseCardDetails.hashSecretBase64 == null ||
        baseCardDetails.hashSecretBase64.isEmpty) {
      model.setVerificationFailure(
          createFieldMissingError("hashSecretBase64", "pepperMissing"));
      return false;
    }
    if (baseCardDetails.expirationDate != null) {
      var now = DateTime.now();
      if (baseCardDetails.expirationDate.isBefore(now)) {
        final dateFormat = DateFormat('dd.MM.yyyy');
        model.setVerificationFailure(VerificationError.fromStrings(
            "Die eingescannte Karte ist bereits "
                "am ${dateFormat.format(baseCardDetails.expirationDate)} "
                "abgelaufen.",
            "cardExpired"));
        return false;
      }
    }
    return true;
  }
}

VerificationError createFieldMissingError(
    String missingFieldName, String publicErrorCode) {
  print("VerificationQrContentParser."
      "processQrCodeContent(String rawBase64Content) failed to parse "
      "qr code because the field '$missingFieldName' was null");
  return VerificationError.fromStrings(
      "Die eingescannte Ehrenamtskarte ist nicht gültig, da erforderliche "
      "Daten fehlen.",
      publicErrorCode);
}
