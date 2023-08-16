import 'dart:convert';
import 'dart:typed_data';

import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql/graphql_api.graphql.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activate_code.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activation_code_parser.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activation_exception.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activation_overwrite_existing_dialog.dart';
import 'package:ehrenamtskarte/identification/connection_failed_dialog.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_scanner_page.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_parsing_error_dialog.dart';
import 'package:ehrenamtskarte/identification/user_code_model.dart';
import 'package:ehrenamtskarte/identification/util/card_info_utils.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/verification_qr_code_processor.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/util/date_utils.dart';
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
    } on ActivationDidNotOverwriteExisting catch (e) {
      await showError(e.toString());
    } on QrCodeFieldMissingException catch (e) {
      await showError(
        "Der Inhalt des eingescannten Codes ist unvollständig. "
        "(Fehlercode: ${e.missingFieldName}Missing)",
      );
    } on QrCodeWrongTypeException catch (_) {
      await showError("Der eingescannte Code kann nicht in der App gespeichert werden.");
    } on CardExpiredException catch (e) {
      final dateFormat = DateFormat("dd.MM.yyyy");
      await showError("Der eingescannte Code ist bereits am "
          "${dateFormat.format(e.expiry)} abgelaufen.");
    } on ServerCardActivationException catch (e, stackTrace) {
      debugPrintStack(stackTrace: stackTrace, label: e.toString());
      await ConnectionFailedDialog.show(
        context,
        "Der eingescannte Code konnte nicht aktiviert "
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
    DynamicActivationCode activationCode, [
    bool overwriteExisting = false,
  ]) async {
    final client = GraphQLProvider.of(context).value;
    final projectId = Configuration.of(context).projectId;
    final provider = Provider.of<UserCodeModel>(context, listen: false);
    final activationSecretBase64 = const Base64Encoder().convert(activationCode.activationSecret);
    final cardInfoBase64 = activationCode.info.hash(activationCode.pepper);

    debugPrint("Card Activation: Sending request with overwriteExisting=$overwriteExisting.");

    final activationResult = await activateCode(
      client: client,
      projectId: projectId,
      activationSecretBase64: activationSecretBase64,
      cardInfoHashBase64: cardInfoBase64,
      overwriteExisting: overwriteExisting,
    );

    switch (activationResult.activationState) {
      case ActivationState.success:
        if (activationResult.totpSecret == null) {
          throw const ActivationInvalidTotpSecretException();
        }
        final totpSecret = const Base64Decoder().convert(activationResult.totpSecret!);
        debugPrint("Card Activation: Successfully activated.");

        provider.setCode(DynamicUserCode()
          ..info = activationCode.info
          ..pepper = activationCode.pepper
          ..totpSecret = totpSecret
          ..cardVerification = (CardVerification()
            ..cardValid = true
            ..verificationTimeStamp = secondsSinceEpoch(DateTime.parse(activationResult.activationTimeStamp))));
        break;
      case ActivationState.failed:
        await QrParsingErrorDialog.showErrorDialog(
          context,
          "Der eingescannte Code ist ungültig.",
        );
        break;
      case ActivationState.didNotOverwriteExisting:
        if (overwriteExisting) {
          throw const ActivationDidNotOverwriteExisting();
        }
        debugPrint(
            "Card Activation: Card had been activated already and was not overwritten. Waiting for user feedback.");
        if (await ActivationOverwriteExistingDialog.showActivationOverwriteExistingDialog(context)) {
          await _activateCode(context, activationCode, overwriteExisting = true);
        }
        break;
      default:
        throw const ServerCardActivationException(
          "Die Aktivierung befindet sich in einem ungültigen Zustand.",
        );
    }
  }
}
