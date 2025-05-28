import 'package:ehrenamtskarte/app.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/intro_slides/decorated_slider.dart';
import 'package:ehrenamtskarte/location/determine_position.dart';
import 'package:ehrenamtskarte/widgets/app_bars.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:provider/provider.dart';

import 'package:ehrenamtskarte/intro_slides/intro_slide.dart';

class IntroPage extends StatefulWidget {
  @override
  State<IntroPage> createState() => _IntroPageState();
}

class _IntroPageState extends State<IntroPage> {
  bool _isProcessing = false;

  Future<void> _onDonePress(SettingsModel settings) async {
    if (_isProcessing) return;
    setState(() => _isProcessing = true);

    try {
      await checkAndRequestLocationPermission(context, requestIfNotGranted: true);
      if (!mounted) return;
      settings.setFirstStart(enabled: false);
      GoRouter.of(context).pushReplacement(homeRouteName);
    } catch (e, stacktrace) {
      debugPrintStack(stackTrace: stacktrace, label: e.toString());
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }

  Widget buildSlider(BuildContext context) {
    final settings = Provider.of<SettingsModel>(context);
    final slides = [
      IntroSlide(
        title: t.intro.welcomeTitle,
        description: t.intro.welcomeDescription,
        pathImage: buildConfig.introSlidesImages[0],
      ),
      IntroSlide(
        title: t.intro.applyTitle,
        description: t.intro.applyDescription,
        pathImage: buildConfig.introSlidesImages[1],
      ),
      IntroSlide(
        title: t.intro.usageTitle,
        description: t.intro.usageDescription,
        pathImage: buildConfig.introSlidesImages[2],
      ),
      IntroSlide(
        title: t.intro.locationTitle,
        description: t.intro.locationDescription,
        pathImage: buildConfig.introSlidesImages[3],
      ),
    ];
    return DecoratedSlider(children: slides, onDonePressed: () => _onDonePress(settings));
  }

  Color backgroundColor(BuildContext context) {
    final theme = Theme.of(context);
    return theme.brightness == Brightness.light ? const Color(0xffECECEC) : theme.colorScheme.surface;
  }

  @override
  Widget build(BuildContext context) {
    final backgroundColor = this.backgroundColor(context);
    return Scaffold(
        backgroundColor: backgroundColor,
        appBar: StatusBarProtector(backgroundColor: backgroundColor),
        extendBodyBehindAppBar: true,
        body: buildSlider(context));
  }
}
