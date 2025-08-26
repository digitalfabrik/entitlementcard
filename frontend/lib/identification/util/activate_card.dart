import 'dart:convert';

import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql_gen/schema.graphql.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activate_code.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activation_exception.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activation_overwrite_existing_dialog.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activation_error_dialog.dart';
import 'package:ehrenamtskarte/identification/user_code_model.dart';
import 'package:ehrenamtskarte/identification/util/card_info_utils.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/sentry.dart';
import 'package:ehrenamtskarte/util/date_utils.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:provider/provider.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

enum ActivationSource { qrScanner, deepLink }

/// Returns
/// - `true`, if the activation was successful,
/// - `false`, if the activation was not successful, but feedback was given to the user,
/// Throws an error otherwise.
Future<bool> activateCard(
  BuildContext context,
  DynamicActivationCode activationCode, {
  required ActivationSource source,
  bool overwriteExisting = false,
}) async {
  final client = GraphQLProvider.of(context).value;
  final projectId = Configuration.of(context).projectId;
  final userCodesModel = Provider.of<UserCodeModel>(context, listen: false);
  final activationSecretBase64 = const Base64Encoder().convert(activationCode.activationSecret);
  final cardInfoBase64 = activationCode.info.hash(activationCode.pepper);
  final messengerState = ScaffoldMessenger.of(context);
  final t = context.t;

  debugPrint('Card Activation: Sending request with overwriteExisting=$overwriteExisting.');

  final activationResult = await activateCode(
    client: client,
    projectId: projectId,
    activationSecretBase64: activationSecretBase64,
    cardInfoHashBase64: cardInfoBase64,
    overwriteExisting: overwriteExisting,
  );

  if (!context.mounted) {
    return false;
  }

  debugPrint('Card Activation: Server returned activation state: ${activationResult.activationState}');
  switch (activationResult.activationState) {
    case Enum$ActivationState.success:
      if (activationResult.totpSecret == null) {
        await reportError('TotpSecret is null during activation', null);
        throw const ActivationInvalidTotpSecretException();
      }
      final totpSecret = const Base64Decoder().convert(activationResult.totpSecret!);

      DynamicUserCode userCode = DynamicUserCode()
        ..info = activationCode.info
        ..pepper = activationCode.pepper
        ..totpSecret = totpSecret
        ..cardVerification = (CardVerification()
          ..cardValid = true
          ..verificationTimeStamp = secondsSinceEpoch(DateTime.parse(activationResult.activationTimeStamp)));

      await userCodesModel.insertCode(userCode);
      debugPrint('Card Activation: Successfully activated.');
      if (context.mounted) {
        messengerState.showSnackBar(SnackBar(content: Text(t.deeplinkActivation.activationSuccessful)));
        if (Navigator.canPop(context)) Navigator.maybePop(context);
      }
      return true;
    case Enum$ActivationState.revoked:
      await ActivationErrorDialog.showErrorDialog(context, t.identification.codeRevoked);
      return false;
    case Enum$ActivationState.not_found:
      await ActivationErrorDialog.showErrorDialog(context, t.identification.cardInvalid);
      return false;
    case Enum$ActivationState.wrong_secret:
      final message = source == ActivationSource.qrScanner
          ? t.identification.codeInvalid
          : t.deeplinkActivation.invalidCode;
      await ActivationErrorDialog.showErrorDialog(context, message);
      return false;
    case Enum$ActivationState.expired:
      await ActivationErrorDialog.showErrorDialog(context, t.identification.cardExpiredBeforeActivation);
      return false;
    case Enum$ActivationState.did_not_overwrite_existing:
      if (overwriteExisting) {
        throw const ActivationDidNotOverwriteExisting();
      }
      if (isAlreadyInList(userCodesModel.userCodes, activationCode.info, activationCode.pepper)) {
        await ActivationErrorDialog.showErrorDialog(context, t.deeplinkActivation.alreadyExists);
        return false;
      }
      debugPrint(
        'Card Activation: Card had been activated already and was not overwritten. Waiting for user feedback.',
      );
      if (await ActivationOverwriteExistingDialog.showActivationOverwriteExistingDialog(context) && context.mounted) {
        return await activateCard(context, activationCode, source: source, overwriteExisting: true);
      } else {
        return false;
      }
    default:
      const errorMessage = 'Die Aktivierung befindet sich in einem ungültigen Zustand.';
      reportError(errorMessage, null);
      throw ServerCardActivationException(errorMessage);
  }
}
