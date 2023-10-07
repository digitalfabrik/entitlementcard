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
import 'package:ehrenamtskarte/routing.dart';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher_string.dart';

class IdentificationPage extends StatefulWidget {
  final String title;
  const IdentificationPage({super.key, required this.title});
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
          return Container();
        }

        if (userCodeModel.userCodes.isNotEmpty) {
          final List<Widget> cards = [];
          for (var code in userCodeModel.userCodes) {
            cards.add(CardDetailView(
              userCode: code,
              startVerification: () => _showVerificationDialog(context, settings),
              startActivation: () => _startActivation(context),
              startApplication: _startApplication,
              removeCard: () => _removeCard(context),
            ));
          }

          return Column(children: [
            CardCarousel(
                userCards: cards,
                cardIndex: cardIndex,
                updateIndex: _updateCardIndex,
                carouselController: carouselController),
          ]);
        }

        return NoCardView(
          startVerification: () => _showVerificationDialog(context, settings),
          startActivation: () => _startActivation(context),
          startApplication: _startApplication,
        );
      },
    );
  }

  Future<void> handleDeniedCameraPermission(BuildContext context) async {
    await QrCodeCameraPermissionDialog.showPermissionDialog(context);
  }

  Future<void> _showVerificationDialog(BuildContext context, SettingsModel settings) async {
    if (await Permission.camera.request().isGranted) {
      await VerificationWorkflow.startWorkflow(context, settings);
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
      Navigator.push(context,
          AppRoute(builder: (context) => ActivationCodeScannerPage(moveToLastCard: _moveCarouselToLastPosition)));
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

  Future<void> _removeCard(BuildContext context) async {
    final userCodeModel = Provider.of<UserCodeModel>(context, listen: false);
    await RemoveCardConfirmationDialog.show(context: context, userCode: userCodeModel.userCodes[cardIndex]);
    carouselController.previousPage(duration: Duration(milliseconds: 500), curve: Curves.linear);
  }

  void _moveCarouselToLastPosition() {
    final userCodeModel = Provider.of<UserCodeModel>(context, listen: false);
    carouselController.jumpToPage(userCodeModel.userCodes.length);
  }
}
