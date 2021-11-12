import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../qr_code_scanner/qr_code_processor.dart';
import '../qr_code_scanner/qr_code_scanner_page.dart';
import '../qr_code_scanner/qr_parsing_error_dialog.dart';
import 'card_details_model.dart';
import 'identification_qr_content_parser.dart';

class IdentificationQrScannerPage extends StatelessWidget {
  const IdentificationQrScannerPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return QrCodeScannerPage(
        onCodeScanned: (code) async => _onCodeScanned(context, code),
    );
  }

  void _onCodeScanned(BuildContext context, String code) async {
    final provider = Provider.of<CardDetailsModel>(context, listen: false);
    Future<void> showError(msg) async =>
        await QrParsingErrorDialog.showErrorDialog(context, msg);
    try {
      IdentificationQrContentParser(provider).processQrCodeContent(code);
    } on QRCodeMissingExpiryException catch (_) {
      await showError("Die eingescannte Karte enthält kein Ablauf-"
          "datum, obwohl dies für die blaue Ehrenamtskarte erforderlich"
          " ist. Vermutlich ist beim Erstellen der "
          "digitalen Ehrenamtskarte ein Fehler passiert.");
    } on QRCodeInvalidTotpSecretException catch (_) {
      await showError("Beim Verarbeiten des eingescannten Codes ist ein"
          "Fehler aufgetreten. Fehlercode: base32TotpSecretInvalid");
    } on QRCodeInvalidExpiryException catch (_) {
      await showError("Beim Verarbeiten des Ablaufdatums ist ein "
          "unerwarteter Fehler aufgetreten.");
    } on QRCodeInvalidFormatException catch (e, s) {
      await showError("Der Inhalt des eingescannten Codes kann nicht "
          "verstanden werden. Vermutlich handelt es sich um einen QR Code, "
          "der nicht für die Ehrenamtskarte-App generiert wurde.");
      debugPrintStack(stackTrace: s, label: e.toString());
      if (e.cause != null && e.stackTrace != null) {
        debugPrint("Caused by:");
        debugPrintStack(stackTrace: e.stackTrace, label: e.cause.toString());
      }
    } on QrCodeFieldMissingException catch (e) {
      await showError("Der Inhalt des eingescannten Codes ist unvollständig. "
          "(Fehlercode: ${e.missingFieldName}Missing)");
    } on Exception catch (e, stacktrace) {
      debugPrintStack(stackTrace: stacktrace, label: e.toString());
      await showError("Ein unerwarteter Fehler ist aufgetreten.");
    }
  }
}
