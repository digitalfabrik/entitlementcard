import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/identification/activation_code_model.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activation_code_parser.dart';
import 'package:ehrenamtskarte/identification/otp_generator.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_scanner_page.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_parsing_error_dialog.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/query_server_verification.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/verification_qr_code_processor.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/widgets/app_bars.dart';
import 'package:flutter/widgets.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class ActivationCodeScannerPage extends StatelessWidget {
  const ActivationCodeScannerPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const CustomAppBar(title: "Karte hinzufügen"),
        Expanded(
          child: QrCodeScannerPage(
            onCodeScanned: (code) async => _onCodeScanned(context, code),
          ),
        ),
      ],
    );
  }

  Future<void> _onCodeScanned(BuildContext context, String code) async {
    final provider = Provider.of<ActivationCodeModel>(context, listen: false);
    Future<void> showError(String msg) async => QrParsingErrorDialog.showErrorDialog(context, msg);

    final client = GraphQLProvider.of(context).value;
    try {
      final activationCode = const ActivationCodeParser().parseQrCodeContent(code);
      final projectId = Configuration.of(context).projectId;
      final generator = OTPGenerator(activationCode.totpSecret);
      final otp = generator.generateOTP();
      final verifyQrCode = DynamicVerifyCode(
        info: activationCode.info,
        pepper: activationCode.pepper,
        otp: otp.code,
      );
      final valid = await queryServerVerification(client, projectId, verifyQrCode);
      if (!valid) {
        await showError(
          "Die zu prüfende Karte ist ungültig.",
        );
        return;
      }

      provider.setCode(activationCode);
    } on QRCodeMissingExpiryException catch (_) {
      await showError(
        "Die eingescannte Karte enthält kein Ablaufdatum, "
        "obwohl dies für die blaue Ehrenamtskarte erforderlich"
        " ist. Vermutlich ist beim Erstellen der "
        "digitalen Ehrenamtskarte ein Fehler passiert.",
      );
    } on QRCodeInvalidTotpSecretException catch (_) {
      await showError(
        "Beim Verarbeiten des eingescannten Codes ist ein "
        "Fehler aufgetreten. Fehlercode: base32TotpSecretInvalid",
      );
    } on QRCodeInvalidFormatException catch (e, s) {
      await showError(
        "Der Inhalt des eingescannten Codes kann nicht "
        "verstanden werden. Vermutlich handelt es sich um einen QR Code, "
        "der nicht für die Ehrenamtskarte-App generiert wurde.",
      );
      debugPrintStack(stackTrace: s, label: e.toString());
      if (e.cause != null && e.stackTrace != null) {
        debugPrint("Caused by:");
        debugPrintStack(stackTrace: e.stackTrace, label: e.cause.toString());
      }
    } on QrCodeFieldMissingException catch (e) {
      await showError(
        "Der Inhalt des eingescannten Codes ist unvollständig. "
        "(Fehlercode: ${e.missingFieldName}Missing)",
      );
    } on CardExpiredException catch (e) {
      final dateFormat = DateFormat("dd.MM.yyyy");
      await showError("Die eingescannte Karte ist bereits am "
          "${dateFormat.format(e.expiry)} abgelaufen.");
    } on Exception catch (e, stacktrace) {
      debugPrintStack(stackTrace: stacktrace, label: e.toString());
      await showError("Ein unerwarteter Fehler ist aufgetreten.");
    }
  }
}
