import 'dart:core';
import 'dart:typed_data';

import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/identification/connection_failed_dialog.dart';
import 'package:ehrenamtskarte/identification/otp_generator.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_scanner_page.dart';
import 'package:ehrenamtskarte/identification/qr_content_parser.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/dialogs/negative_verification_result_dialog.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/dialogs/positive_verification_result_dialog.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/dialogs/verification_info_dialog.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/query_server_verification.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/verification_qr_code_processor.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/widgets/app_bars.dart' show CustomAppBar;
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class VerificationQrScannerPage extends StatelessWidget {
  final DynamicUserCode? userCode;

  const VerificationQrScannerPage({super.key, this.userCode});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final config = Configuration.of(context);
    final settings = Provider.of<SettingsModel>(context);
    final currentUserCode = userCode;
    final theme = Theme.of(context);
    return Column(
      children: [
        CustomAppBar(
          title: t.identification.verifyTitle,
          actions: [
            IconButton(
              icon: const Icon(Icons.help),
              color: theme.appBarTheme.foregroundColor,
              onPressed: () async {
                await settings.setHideVerificationInfo(enabled: false);
                if (context.mounted) await VerificationInfoDialog.show(context);
              },
            ),
          ],
        ),
        Expanded(child: QrCodeScannerPage(onCodeScanned: (code) => _handleQrCode(context, code))),
        if (config.showDevSettings && currentUserCode != null)
          TextButton(
            onPressed: () async {
              final otp = OTPGenerator(currentUserCode.totpSecret).generateOTP().code;
              final verificationQrCode = QrCode()
                ..dynamicVerificationCode = (DynamicVerificationCode()
                  ..info = currentUserCode.info
                  ..pepper = currentUserCode.pepper
                  ..otp = otp);
              final verificationCode = verificationQrCode.writeToBuffer();
              _handleQrCode(context, verificationCode);
            },
            child: const Text('Verify activated Card'),
          ),
      ],
    );
  }

  Future<void> _handleQrCode(BuildContext context, Uint8List rawQrContent) async {
    Future<void> onError(String message, [Exception? exception]) async {
      if (exception != null) {
        debugPrint('Verification failed: $exception');
      }
      if (context.mounted) {
        await NegativeVerificationResultDialog.show(context, message);
      }
    }

    Future<void> onConnectionError(String message, [Exception? exception]) async {
      if (exception != null) {
        debugPrint('Connection failed: $exception');
      }
      if (context.mounted) {
        await ConnectionFailedDialog.show(context, message);
      }
    }

    Future<void> onSuccess(CardInfo cardInfo, bool isStaticVerificationCode) async {
      await PositiveVerificationResultDialog.show(
        context: context,
        cardInfo: cardInfo,
        isStaticVerificationCode: isStaticVerificationCode,
      );
    }

    try {
      final qrcode = rawQrContent.parseQRCodeContent();

      final cardInfo = await verifyQrCodeContent(context, qrcode);
      if (cardInfo == null) {
        await onError(t.identification.codeVerificationFailed);
        return;
      }
      if (!context.mounted) {
        return;
      }
      await onSuccess(cardInfo, qrcode.hasStaticVerificationCode());
      if (!context.mounted) {
        return;
      }
      await Navigator.of(context).maybePop();
      return;
    } on ServerVerificationException catch (e) {
      await onConnectionError(t.identification.codeVerificationFailedConnection, e);
    } on QrCodeFieldMissingException catch (e) {
      await onError(t.identification.codeInvalidMissing(missing: e.missingFieldName), e);
    } on CardExpiredException catch (e) {
      final expirationDate = DateFormat('dd.MM.yyyy').format(e.expiry);
      await onError(t.identification.codeExpired(expirationDate: expirationDate), e);
    } on CardNotYetValidException catch (e) {
      final startDay = DateFormat('dd.MM.yyyy').format(e.startDay);
      await onError(t.identification.codeNotYetValid(startDay: startDay), e);
    } on QrCodeParseException catch (e) {
      await onError(t.identification.codeInvalid, e);
    } on Exception catch (e) {
      await onError(t.identification.codeUnknownType, e);
    }
  }
}
