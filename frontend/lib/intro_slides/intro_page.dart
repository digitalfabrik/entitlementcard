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

class IntroTab extends StatelessWidget {
  final String title;
  final String description;
  final String pathImage;

  const IntroTab({
    super.key,
    required this.title,
    required this.description,
    required this.pathImage,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return MediaQuery.removePadding(
      context: context,
      removeBottom: true,
      removeTop: true,
      removeLeft: true,
      removeRight: true,
      child: ListView(
        // Only allow scrolling (vertically) if there is sufficient content.
        // This improves the experience to scroll (horizontally) with the Slider controller.
        primary: false,
        padding: MediaQuery.maybePaddingOf(context),
        children: [
          Container(
            // Title
            margin: const EdgeInsets.only(
              top: 70.0,
              bottom: 50.0,
              left: 20.0,
              right: 20.0,
            ),
            child: Text(
              title,
              style: theme.textTheme.headlineSmall,
              maxLines: 3,
              textAlign: TextAlign.center,
              overflow: TextOverflow.ellipsis,
            ),
          ),

          Image.asset(
            pathImage,
            width: 200.0,
            height: 200.0,
            fit: BoxFit.contain,
          ),

          // Description
          Container(
            margin: const EdgeInsets.fromLTRB(20.0, 50.0, 20.0, 50.0),
            child: Text(
              description,
              style: theme.textTheme.bodyLarge?.apply(fontSizeFactor: 1.2),
              textAlign: TextAlign.center,
              maxLines: 100,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}

class IntroPage extends StatelessWidget {
  Future<void> _onDonePress(BuildContext context) async {
    final settings = Provider.of<SettingsModel>(context, listen: false);
    await checkAndRequestLocationPermission(context, requestIfNotGranted: true);
    settings.setFirstStart(enabled: false);
    if (!context.mounted) return;
    GoRouter.of(context).pushReplacement(homeRouteName);
  }

  Widget buildSlider(BuildContext context) {
    final slides = [
      IntroTab(
        title: t.intro.welcomeTitle,
        description: t.intro.welcomeDescription,
        pathImage: buildConfig.introSlidesImages[0],
      ),
      IntroTab(
        title: t.intro.applyTitle,
        description: t.intro.applyDescription,
        pathImage: buildConfig.introSlidesImages[1],
      ),
      IntroTab(
        title: t.intro.usageTitle,
        description: t.intro.usageDescription,
        pathImage: buildConfig.introSlidesImages[2],
      ),
      IntroTab(
        title: t.intro.locationTitle,
        description: t.intro.locationDescription,
        pathImage: buildConfig.introSlidesImages[3],
      ),
    ];
    return DecoratedSlider(children: slides, onDonePressed: () => _onDonePress(context));
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
