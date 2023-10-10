import 'dart:convert';
import 'dart:developer';

import 'package:base32/base32.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/graphql/graphql_api.graphql.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activate_code.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activation_code_parser.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activation_exception.dart';
import 'package:ehrenamtskarte/identification/card_detail_view/self_verify_card.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_parsing_error_dialog.dart';
import 'package:ehrenamtskarte/identification/user_code_model.dart';
import 'package:ehrenamtskarte/identification/util/card_info_utils.dart';
import 'package:ehrenamtskarte/intro_slides/intro_screen.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/routing.dart';
import 'package:ehrenamtskarte/util/date_utils.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:provider/provider.dart';

// this data includes a Base32 encoded random key created with openssl
// for testing, so this is intended
final sampleActivationCodeBavaria = DynamicUserCode()
  ..info = (CardInfo()
    ..fullName = 'Erika Mustermann'
    ..expirationDay = 19746
    ..extensions = (CardExtensions()
      ..extensionBavariaCardType = (BavariaCardTypeExtension()..cardType = BavariaCardType.STANDARD)
      ..extensionRegion = (RegionExtension()..regionId = 42)))
  ..pepper = const Base64Decoder().convert('aGVsbG8gdGhpcyBpcyBhIHRlc3Q=')
  ..totpSecret = base32.decode('MZLBSF6VHD56ROVG55J6OKJCZIPVDPCX');

final sampleActivationCodeNuernberg = DynamicUserCode()
  ..info = (CardInfo()
    ..fullName = 'Erika Mustermann'
    ..expirationDay = 19746
    ..extensions = (CardExtensions()
      ..extensionBirthday = (BirthdayExtension()..birthday = 19746)
      ..extensionNuernbergPassNumber = (NuernbergPassNumberExtension()..passNumber = 12323123)
      ..extensionRegion = (RegionExtension()..regionId = 93)
      ..extensionStartDay = (StartDayExtension()..startDay = 19592)))
  ..pepper = const Base64Decoder().convert('aGVsbG8gdGhpcyBpcyBhIHRlc3Q=')
  ..totpSecret = base32.decode('MZLBSF6VHD56ROVG55J6OKJCZIPVDPCX');

class DevSettingsView extends StatelessWidget {
  const DevSettingsView({super.key});

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsModel>(context);
    final client = GraphQLProvider.of(context).value;
    final userCodeModel = Provider.of<UserCodeModel>(context);
    return Padding(
      padding: const EdgeInsets.all(15.0),
      child: Column(
        children: [
          ListTile(
            title: const Text('Reset cards'),
            onTap: () => _resetEakData(context, userCodeModel),
          ),
          ListTile(
            title: const Text('Set (invalid) sample card'),
            onTap: () => _setSampleCard(context),
          ),
          ListTile(
            title: const Text('Set base64 card'),
            onTap: () => _showRawCardInput(context),
          ),
          ListTile(
            title: const Text('Show Intro Slides'),
            onTap: () => _showIntroSlides(context),
          ),
          ListTile(
            title: const Text('Set expired last card verification'),
            onTap: () => _setExpiredLastVerifications(context),
          ),
          ListTile(
              title: const Text('Trigger self-verification'),
              onTap: () => {
                    for (final userCode in userCodeModel.userCodes)
                      {selfVerifyCard(context, userCode, Configuration.of(context).projectId, client)}
                  }),
          ListTile(
            title: const Text('Log sample exception'),
            onTap: () => log('Sample exception.', error: Exception('Sample exception...')),
          ),
          ListTile(
            title: const Text('Inspect settings'),
            onTap: () {
              showDialog<bool>(
                context: context,
                builder: (context) =>
                    SimpleDialog(title: const Text('Settings'), children: [Text(settings.toString())]),
              );
            },
          ),
        ],
      ),
    );
  }

  Future<void> _resetEakData(BuildContext context, UserCodeModel userCodesModel) async {
    userCodesModel.removeCodes();
  }

  DynamicUserCode _determineUserCode(String projectId) {
    switch (projectId) {
      case 'bayern.ehrenamtskarte.app':
        {
          return sampleActivationCodeBavaria;
        }
      case 'nuernberg.sozialpass.app':
        {
          return sampleActivationCodeNuernberg;
        }
      default:
        {
          return sampleActivationCodeBavaria;
        }
    }
  }

  Future<void> _setSampleCard(BuildContext context) async {
    Provider.of<UserCodeModel>(context, listen: false).insertCode(_determineUserCode(buildConfig.projectId.local));
  }

  Future<void> _showRawCardInput(BuildContext context) async {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        final base64Controller = TextEditingController();
        return AlertDialog(
          scrollable: true,
          title: const Text('Activate Card from Base64'),
          content: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Form(
              child: Column(
                children: <Widget>[
                  const SelectableText(
                    'Create a QR code from a PDF: pdftoppm berechtigungskarten.pdf | zbarimg -q --raw  -',
                  ),
                  TextFormField(
                    controller: base64Controller,
                    decoration: const InputDecoration(
                      labelText: 'Base64 data',
                      icon: Icon(Icons.card_membership),
                    ),
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              child: const Text('Activate Card'),
              onPressed: () {
                _activateCard(context, base64Controller.text);
              },
            )
          ],
        );
      },
    );
  }

  Future<void> _activateCard(BuildContext context, String base64qrcode) async {
    final messengerState = ScaffoldMessenger.of(context);
    final userCodesModel = Provider.of<UserCodeModel>(context, listen: false);
    final client = GraphQLProvider.of(context).value;
    final projectId = Configuration.of(context).projectId;
    try {
      final activationCode =
          const ActivationCodeParser().parseQrCodeContent(const Base64Decoder().convert(base64qrcode));

      final activationResult = await activateCode(
        client: client,
        projectId: projectId,
        activationSecretBase64: const Base64Encoder().convert(activationCode.activationSecret),
        cardInfoHashBase64: activationCode.info.hash(activationCode.pepper),
        overwriteExisting: true,
      );

      switch (activationResult.activationState) {
        case ActivationState.success:
          if (activationResult.totpSecret == null) {
            throw const ActivationInvalidTotpSecretException();
          }
          final totpSecret = const Base64Decoder().convert(activationResult.totpSecret!);
          final userCode = DynamicUserCode()
            ..info = activationCode.info
            ..pepper = activationCode.pepper
            ..totpSecret = totpSecret;
          userCodesModel.insertCode(userCode);
          break;
        case ActivationState.failed:
          await QrParsingErrorDialog.showErrorDialog(
            context,
            'Der eingescannte Code ist ungültig.',
          );
          break;
        case ActivationState.didNotOverwriteExisting:
          throw const ActivationDidNotOverwriteExisting();
        default:
          throw const ServerCardActivationException(
            'Die Aktivierung befindet sich in einem ungültigen Zustand.',
          );
      }

      messengerState.showSnackBar(
        const SnackBar(
          content: Text('Aktivierung erfolgreich.'),
        ),
      );
      Navigator.pop(context);
    } on QrCodeParseException catch (e, _) {
      messengerState.showSnackBar(
        SnackBar(
          content: Text(e.reason),
        ),
      );
    }
  }

  void _showIntroSlides(BuildContext context) {
    Navigator.push(
      context,
      AppRoute(
        builder: (context) => const IntroScreen(),
      ),
    );
  }

  void _setExpiredLastVerifications(BuildContext context) {
    final userCodesModel = Provider.of<UserCodeModel>(context, listen: false);
    if (userCodesModel.userCodes.isNotEmpty) {
      List<DynamicUserCode> userCodes = userCodesModel.userCodes;
      for (final userCode in userCodes) {
        _setExpiredLastVerification(context, userCode);
      }
    }
  }

// This is used to check the invalidation of a card because the verification with the backend couldn't be done lately (1 week plus UTC tolerance)
  void _setExpiredLastVerification(BuildContext context, DynamicUserCode userCode) {
    final userCodesModel = Provider.of<UserCodeModel>(context, listen: false);
    final CardVerification cardVerification = CardVerification()
      ..verificationTimeStamp =
          secondsSinceEpoch(DateTime.now().toUtc().subtract(Duration(seconds: cardValidationExpireSeconds + 3600)))
      ..cardValid = true;
    userCodesModel.updateCode(DynamicUserCode()
      ..info = userCode.info
      ..ecSignature = userCode.ecSignature
      ..pepper = userCode.pepper
      ..totpSecret = userCode.totpSecret
      ..cardVerification = cardVerification);
  }
}
