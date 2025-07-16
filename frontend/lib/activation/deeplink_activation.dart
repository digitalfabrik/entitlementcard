import 'dart:convert';
import 'package:ehrenamtskarte/app.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/home/home_page.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activate_code.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activation_code_parser.dart';
import 'package:ehrenamtskarte/identification/connection_failed_dialog.dart';
import 'package:ehrenamtskarte/identification/id_card/id_card_with_region_query.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/identification/user_code_model.dart';
import 'package:ehrenamtskarte/identification/util/activate_card.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/verification_qr_code_processor.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/util/string_utils.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

enum DeepLinkActivationStatus {
  // Activation is invalid
  invalid,

  /// The card already exists on the device.
  alreadyExists,

  /// The card limit is reached on the device.
  limitReached,

  /// The card can be activated
  valid;

  factory DeepLinkActivationStatus.from(UserCodeModel userCodeModel, DynamicActivationCode? activationCode) {
    if (activationCode == null) {
      return DeepLinkActivationStatus.invalid;
    } else if (isAlreadyInList(userCodeModel.userCodes, activationCode.info, activationCode.pepper)) {
      return DeepLinkActivationStatus.alreadyExists;
    } else if (hasReachedCardLimit(userCodeModel.userCodes)) {
      return DeepLinkActivationStatus.limitReached;
    } else {
      return DeepLinkActivationStatus.valid;
    }
  }
}

class DeepLinkActivation extends StatefulWidget {
  final String encodedBase64QrCode;

  const DeepLinkActivation({super.key, required this.encodedBase64QrCode});

  @override
  State<DeepLinkActivation> createState() => _DeepLinkActivationState();
}

enum _State {
  waiting,
  loading,
  success,
}

class _DeepLinkActivationState extends State<DeepLinkActivation> {
  _State _state = _State.waiting;
  String? errorMessage;

  void updateErrorMessage(String message) {
    setState(() {
      errorMessage = message;
    });
  }

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    DynamicActivationCode? activationCode = getActivationCode(context, widget.encodedBase64QrCode, updateErrorMessage);
    CardInfo? cardInfo = activationCode?.info;
    final userCodeModel = Provider.of<UserCodeModel>(context);

    if (!userCodeModel.isInitialized) {
      if (userCodeModel.initializationFailed) {
        return SafeArea(child: Center(child: Text(t.common.unknownError, textAlign: TextAlign.center)));
      }
      return Container();
    }

    final status = DeepLinkActivationStatus.from(userCodeModel, activationCode);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(t.deeplinkActivation.headline),
        leading: BackButton(onPressed: () => {GoRouter.of(context).pop()}),
      ),
      body: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              if (status != DeepLinkActivationStatus.invalid)
                Padding(
                  padding: const EdgeInsets.all(20),
                  child: Text(t.deeplinkActivation.description,
                      style: theme.textTheme.headlineSmall, textAlign: TextAlign.center),
                ),
              if (cardInfo != null)
                Center(
                    child: IdCardWithRegionQuery(
                  cardInfo: cardInfo,
                  // We trust the backend to have checked for expiration.
                  isExpired: false,
                  isNotYetValid: false,
                )),
              Padding(
                padding: const EdgeInsets.all(32),
                child: Column(mainAxisSize: MainAxisSize.min, children: [
                  if (_state == _State.waiting) _WarningText(status, userCodeModel, errorMessage),
                  ElevatedButton.icon(
                    onPressed:
                        activationCode != null && _state == _State.waiting && status == DeepLinkActivationStatus.valid
                            ? () async {
                                setState(() {
                                  _state = _State.loading;
                                });
                                try {
                                  final activated =
                                      await activateCard(context, activationCode, source: ActivationSource.deepLink);
                                  if (!context.mounted) return;
                                  if (activated) {
                                    final cardIndex =
                                        Provider.of<UserCodeModel>(context, listen: false).userCodes.length - 1;
                                    GoRouter.of(context).pushReplacement('$homeRouteName/$identityTabIndex/$cardIndex');
                                    setState(() {
                                      _state = _State.success;
                                    });
                                  } else {
                                    setState(() {
                                      _state = _State.waiting;
                                    });
                                  }
                                } on ServerCardActivationException catch (_) {
                                  if (!context.mounted) return;
                                  setState(() {
                                    _state = _State.waiting;
                                  });

                                  await ConnectionFailedDialog.show(
                                      context, t.identification.codeActivationFailedConnection);
                                } catch (_) {
                                  if (!context.mounted) return;
                                  setState(() {
                                    _state = _State.waiting;
                                  });
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text(t.common.unknownError),
                                    ),
                                  );
                                  rethrow;
                                }
                              }
                            : null,
                    icon: _state != _State.waiting
                        ? Container(
                            width: 24,
                            height: 24,
                            padding: const EdgeInsets.all(2.0),
                            child: const CircularProgressIndicator(
                              strokeWidth: 3,
                            ),
                          )
                        : const Icon(Icons.add_card),
                    label: Text(t.deeplinkActivation.buttonText),
                  )
                ]),
              ),
            ],
          )),
    );
  }
}

class _WarningText extends StatelessWidget {
  final DeepLinkActivationStatus status;
  final UserCodeModel userCodeModel;
  final String? errorMessage;

  const _WarningText(this.status, this.userCodeModel, this.errorMessage);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final String cardsInUse = userCodeModel.userCodes.length.toString();
    final String maxCardAmount = buildConfig.maxCardAmount.toString();
    final text = switch (status) {
      DeepLinkActivationStatus.invalid => errorMessage ?? t.deeplinkActivation.activationInvalid,
      DeepLinkActivationStatus.limitReached => '${t.deeplinkActivation.limitReached} ($cardsInUse/$maxCardAmount)',
      DeepLinkActivationStatus.alreadyExists => t.deeplinkActivation.alreadyExists,
      DeepLinkActivationStatus.valid => '',
    };
    if (status == DeepLinkActivationStatus.valid) {
      return Container();
    }
    return Center(
      child: Padding(
          padding: EdgeInsets.symmetric(vertical: 8),
          child: Column(
            children: [
              Icon(Icons.warning, color: theme.colorScheme.secondary),
              Text(text, textAlign: TextAlign.center, style: theme.textTheme.bodyMedium)
            ],
          )),
    );
  }
}

DynamicActivationCode? getActivationCode(
    BuildContext context, String encodedBase64QrCode, Function(String message) updateErrorMessage) {
  // GoRouter 13.x did not handle uri fragments properly without trailing slash.
  // Therefore we need legacy support for old deep links that have a trailing slash.
  final sanitizedBase64QrCode = removeTrailingSlash(encodedBase64QrCode);
  try {
    final activationCode = const ActivationCodeParser()
        .parseQrCodeContent(const Base64Decoder().convert(Uri.decodeComponent(sanitizedBase64QrCode)));
    return activationCode;
  } on CardExpiredException catch (e, _) {
    updateErrorMessage(
        t.deeplinkActivation.cardExpiredExceptionMessage(expiryDate: DateFormat('dd.MM.yyyy').format(e.expiry)));
    return null;
  } on QrCodeParseException catch (e, _) {
    updateErrorMessage(t.deeplinkActivation.qrCodeParseExceptionMessage);
    return null;
  } on FormatException catch (e, _) {
    updateErrorMessage(t.deeplinkActivation.formatExceptionMessage);
    return null;
  }
}
