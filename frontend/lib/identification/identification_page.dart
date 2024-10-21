import 'package:carousel_slider/carousel_controller.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activation_code_scanner_page.dart';
import 'package:ehrenamtskarte/identification/card_detail_view/card_carousel.dart';
import 'package:ehrenamtskarte/identification/card_detail_view/card_detail_view.dart';
import 'package:ehrenamtskarte/identification/no_card_view.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_camera_permission_dialog.dart';
import 'package:ehrenamtskarte/identification/user_code_model.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/dialogs/remove_card_confirmation_dialog.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/verification_workflow.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/routing.dart';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher_string.dart';

class IdentificationPage extends StatefulWidget {
  const IdentificationPage({super.key});

  @override
  IdentificationPageState createState() => IdentificationPageState();
}

class IdentificationPageState extends State<IdentificationPage> {
  CarouselController carouselController = CarouselController();
  int cardIndex = 0;

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsModel>(context);

    return Consumer<UserCodeModel>(
      builder: (context, userCodeModel, child) {
        if (!userCodeModel.isInitialized) {
          if (userCodeModel.initializationFailed) {
            return SafeArea(child: Center(child: Text(context.t.common.unknownError, textAlign: TextAlign.center)));
          }
          return Container();
        }

        if (userCodeModel.userCodes.isNotEmpty) {
          final List<Widget> carouselCards = [];
          for (var code in userCodeModel.userCodes) {
            carouselCards.add(CardDetailView(
              userCode: code,
              startVerification: () => _showVerificationDialog(context, settings, userCodeModel),
              startActivation: () => _startActivation(context),
              startApplication: _startApplication,
              openRemoveCardDialog: () => _openRemoveCardDialog(context, userCodeModel),
            ));
          }

          return CardCarousel(
              cards: carouselCards,
              cardIndex: cardIndex,
              updateIndex: _updateCardIndex,
              carouselController: carouselController);
        }

        return NoCardView(
          startVerification: () => _showVerificationDialog(context, settings, userCodeModel),
          startActivation: () => _startActivation(context),
          startApplication: _startApplication,
        );
      },
    );
  }

  Future<void> handleDeniedCameraPermission(BuildContext context) async {
    await QrCodeCameraPermissionDialog.showPermissionDialog(context);
  }

  Future<void> _showVerificationDialog(
      BuildContext context, SettingsModel settings, UserCodeModel userCodeModel) async {
    if (await Permission.camera.request().isGranted) {
      DynamicUserCode? userCode = userCodeModel.userCodes.isNotEmpty ? userCodeModel.userCodes[cardIndex] : null;
      await VerificationWorkflow.startWorkflow(context, settings, userCode);
      return;
    }
    handleDeniedCameraPermission(context);
  }

  Future<void> _updateCardIndex(int index) async {
    setState(() {
      cardIndex = index;
    });
  }

  Future<void> _startActivation(BuildContext context) async {
    if (await Permission.camera.request().isGranted) {
      Navigator.of(context, rootNavigator: true)
          .push(AppRoute(builder: (context) => ActivationCodeScannerPage(moveToLastCard: _moveCarouselToLastPosition)));
      return;
    }
    handleDeniedCameraPermission(context);
  }

  Future<bool> _startApplication() {
    return launchUrlString(
      buildConfig.applicationUrl,
      mode: LaunchMode.externalApplication,
    );
  }

  Future<void> _openRemoveCardDialog(BuildContext context, UserCodeModel userCodeModel) async {
    final removed =
        await RemoveCardConfirmationDialog.show(context: context, userCode: userCodeModel.userCodes[cardIndex]);
    if (removed && userCodeModel.userCodes.isNotEmpty) {
      carouselController.previousPage(duration: Duration(milliseconds: 500), curve: Curves.linear);
    }
  }

  void _moveCarouselToLastPosition() {
    final userCodeModel = Provider.of<UserCodeModel>(context, listen: false);
    final int cardAmount = userCodeModel.userCodes.length;
    // the carousel controller causes an error if you try to move if there is only one item
    if (cardAmount > 1) {
      carouselController.jumpToPage(cardAmount);
    }
  }
}
