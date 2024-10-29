import 'dart:typed_data';

import 'package:ehrenamtskarte/identification/activation_workflow/activate_code.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activation_code_parser.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activation_exception.dart';
import 'package:ehrenamtskarte/identification/connection_failed_dialog.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_scanner_page.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_parsing_error_dialog.dart';
import 'package:ehrenamtskarte/identification/util/activate_card.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/verification_qr_code_processor.dart';
import 'package:ehrenamtskarte/sentry.dart';
import 'package:ehrenamtskarte/widgets/app_bars.dart';
import 'package:flutter/widgets.dart';
import 'package:intl/intl.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class ActivationCodeScannerPage extends StatelessWidget {
  final VoidCallback moveToLastCard;
  const ActivationCodeScannerPage({super.key, required this.moveToLastCard});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    return Column(
      children: [
        CustomAppBar(title: t.identification.activateTitle),
        Expanded(
          child: QrCodeScannerPage(
            onCodeScanned: (code) async => _onCodeScanned(context, code),
          ),
        ),
      ],
    );
  }

  Future<void> _onCodeScanned(BuildContext context, Uint8List code) async {
    Future<void> showError(String msg, dynamic stackTrace) async {
      reportError(msg, stackTrace);
      if (!context.mounted) return;
      await QrParsingErrorDialog.showErrorDialog(context, msg);
    }

    try {
      final activationCode = const ActivationCodeParser().parseQrCodeContent(code);

      final activated = await activateCard(context, activationCode);
      if (activated) {
        moveToLastCard();
      }
    } on ActivationDidNotOverwriteExisting catch (_) {
      await showError(t.identification.cardAlreadyActivated, null);
    } on QrCodeFieldMissingException catch (e) {
      await showError(t.identification.codeInvalidMissing(missing: e.missingFieldName), null);
    } on QrCodeWrongTypeException catch (_) {
      if (!context.mounted) return;
      await QrParsingErrorDialog.showErrorDialog(context, t.identification.codeInvalidType);
    } on CardExpiredException catch (e) {
      final expirationDate = DateFormat('dd.MM.yyyy').format(e.expiry);
      await showError(t.identification.codeExpired(expirationDate: expirationDate), null);
    } on ServerCardActivationException catch (_) {
      if (!context.mounted) return;
      await ConnectionFailedDialog.show(context, t.identification.codeActivationFailedConnection);
    } on Exception catch (e, stacktrace) {
      debugPrintStack(stackTrace: stacktrace, label: e.toString());
      await showError(t.identification.codeUnknownType, stacktrace);
    }
  }
}
