import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../qr_code_scanner/qr_code_parser.dart';
import '../qr_code_scanner/qr_code_scanner.dart';
import '../qr_code_scanner/qr_parsing_error_dialog.dart';
import 'card_details_model.dart';
import 'identification_qr_content_parser.dart';

class IdentificationQrScannerPage extends StatelessWidget {
  IdentificationQrScannerPage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Ehrenamtskarte hinzufügen"),
      ),
      body: QRCodeScanner(
        onCodeScanned: (code) => _onCodeScanned(context, code),
      )
    );
  }

  _onCodeScanned(BuildContext context, String code) {
    final provider = Provider.of<CardDetailsModel>(context, listen: false);
    void showError(msg) => QrParsingErrorDialog.showErrorDialog(context, msg);
    try {
      IdentificationQrContentParser(provider).processQrCodeContent(code);
    } on QRCodeMissingExpiryException catch (_) {
      showError("Die eingescannte Karte enthält kein Ablauf-"
          "datum, obwohl dies für die blaue Ehrenamtskarte erforderlich"
          " ist. Vermutlich ist beim Erstellen der "
          "digitalen Ehrenamtskarte ein Fehler passiert.");
    } on QRCodeInvalidTotpSecretException catch (_) {
      showError("Beim Verarbeiten des eingescannten Codes ist ein"
          "Fehler aufgetreten. Fehlercode: base32TotpSecretInvalid");
    } on QRCodeInvalidExpiryException catch (_) {
      showError("Beim Verarbeiten des Ablaufdatums ist ein "
          "unerwarteter Fehler aufgetreten.");
    } on QRCodeInvalidFormatException catch (_) {
      showError("Der Inhalt des eingescannten Codes kann nicht verstanden "
          "werden. Vermutlich handelt es sich um einen QR Code, "
          "der nicht für die Ehrenamtskarte App generiert wurde.");
    } on QRCodeFieldMissingException catch (e) {
      showError("Der Inhalt des eingescannten Codes ist unvollständig. "
          "(Fehlercode: ${e.missingFieldName}Missing)");
    } on QRCodeParseException catch (_) {
      showError("Ein unerwarteter Fehler ist aufgetreten.");
    }
  }
}
