import 'dart:convert';
import 'dart:typed_data';

import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql/graphql_api.graphql.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activate_code.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activation_code_parser.dart';
import 'package:ehrenamtskarte/identification/connection_failed_dialog.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_scanner_page.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_parsing_error_dialog.dart';
import 'package:ehrenamtskarte/identification/user_code_model.dart';
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
    final localization = buildConfig.localization.identification.activationCodeScanner;
    return Column(
      children: [
        CustomAppBar(title: localization.title),
        Expanded(
          child: QrCodeScannerPage(
            onCodeScanned: (code) async => _onCodeScanned(context, code),
          ),
        ),
      ],
    );
  }

  Future<void> _onCodeScanned(BuildContext context, Uint8List code) async {
    Future<void> showError(String msg) async => QrParsingErrorDialog.showErrorDialog(context, msg);

    try {
      final activationCode = const ActivationCodeParser().parseQrCodeContent(code);

      await _activateCode(context, activationCode);
    } on QRCodeMissingExpiryException catch (_) {
      await showError(
        "Der eingescannte Code enthält ein ungültiges Ablaufdatum.",
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
        "der nicht für diese App generiert wurde.",
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
      await showError("Der eingescannte Code ist bereits am "
          "${dateFormat.format(e.expiry)} abgelaufen.");
    } on ServerVerificationException catch (e, stackTrace) {
      debugPrintStack(stackTrace: stackTrace, label: e.toString());
      await ConnectionFailedDialog.show(
        context,
        "Der eingescannte Code konnte nicht verifiziert "
        "werden, da die Kommunikation mit dem Server fehlschlug. "
        "Bitte prüfen Sie Ihre Internetverbindung.",
      );
    } on Exception catch (e, stacktrace) {
      debugPrintStack(stackTrace: stacktrace, label: e.toString());
      await showError("Ein unerwarteter Fehler ist aufgetreten.");
    }
  }

  Future<void> _activateCode(
    BuildContext context,
    DynamicActivationCode activationCode,
  ) async {
    final client = GraphQLProvider.of(context).value;
    final projectId = Configuration.of(context).projectId;
    final provider = Provider.of<UserCodeModel>(context, listen: false);

    final activationResult = await activateCode(
      client: client,
      projectId: projectId,
      code: activationCode,
      overwriteExisting: true,
    );

    switch (activationResult.activationState) {
      case ActivationState.success:
        if (activationResult.totpSecret != null) {
          final totpSecret = const Base64Decoder().convert(activationResult.totpSecret!);
          final userCode = DynamicUserCode(
            info: activationCode.info,
            pepper: activationCode.pepper,
            totpSecret: totpSecret,
          );
          provider.setCode(userCode);
        }
        break;
      case ActivationState.failed:
        await QrParsingErrorDialog.showErrorDialog(
          context,
          "Der eingescannte Code ist ungültig.",
        );
        break;
      case ActivationState.didNotOverwriteExisting:
      // TODO: ask user to overwrite code
      default:
    }
  }
}
