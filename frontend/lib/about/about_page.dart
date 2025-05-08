import 'package:ehrenamtskarte/about/backend_switch_dialog.dart';
import 'package:ehrenamtskarte/about/content_tile.dart';
import 'package:ehrenamtskarte/about/dev_settings_view.dart';
import 'package:ehrenamtskarte/about/language_change.dart';
import 'package:ehrenamtskarte/about/license_page.dart';
import 'package:ehrenamtskarte/about/section.dart';
import 'package:ehrenamtskarte/about/texts.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/routing.dart';
import 'package:flutter/material.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:url_launcher/url_launcher_string.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

const String accessibilityPolicyUrl = 'https://berechtigungskarte.app/barrierefreiheit/';

class AboutPage extends StatefulWidget {
  final countToEnableSwitch = 10;

  const AboutPage({super.key});

  @override
  AboutPageState createState() => AboutPageState();
}

class AboutPageState extends State<AboutPage> {
  int clickCount = 0;
  late Future<PackageInfo> packageInfo;

  @override
  void initState() {
    super.initState();
    packageInfo = PackageInfo.fromPlatform();
  }

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    final colorTheme = Theme.of(context).colorScheme;
    final config = Configuration.of(context);
    final t = context.t;
    return FutureBuilder<PackageInfo>(
      future: packageInfo,
      builder: (context, snapshot) {
        List<Widget> children;
        final packageInfo = snapshot.data;
        if (snapshot.hasData && packageInfo != null) {
          children = [
            Container(height: 20),
            Center(
              child: Padding(
                padding: const EdgeInsets.all(10),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(20.0),
                  child: GestureDetector(
                    onTap: () => activateDialog(context),
                    child: Image(
                      image: AssetImage(buildConfig.iconInAboutTab),
                      height: 100.0,
                      width: 100.0,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
              ),
            ),
            Center(
              child: Text(packageInfo.appName, style: textTheme.headlineSmall),
            ),
            Center(
              child: Text(packageInfo.version, style: TextStyle(color: colorTheme.tertiary)),
            ),
            const SizedBox(height: 20),
            const Divider(
              height: 1,
              thickness: 1,
            ),
            InkWell(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    Center(
                      child: Text(t.about.publisher, style: textTheme.titleSmall),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(left: 10, right: 10, top: 16, bottom: 16),
                      child: Text(buildConfig.publisherAddress),
                    ),
                    Text(
                      t.about.moreInformation,
                      style: textTheme.bodyLarge?.apply(color: colorTheme.secondary),
                    ),
                  ],
                ),
              ),
              onTap: () {
                Navigator.of(context, rootNavigator: true).push(
                  AppRoute(
                    builder: (context) => ContentPage(title: t.about.publisher, children: getPublisherText(context)),
                  ),
                );
              },
            ),
            if (buildConfig.appLocales.length > 1)
              Column(children: [
                const Divider(
                  height: 1,
                  thickness: 1,
                ),
                Section(
                  headline: t.about.settingsTitle,
                  children: [
                    ContentTile(icon: Icons.language, title: t.about.languageChange, children: [LanguageChange()]),
                  ],
                ),
              ]),
            const Divider(
              height: 1,
              thickness: 1,
            ),
            Section(headline: t.about.infoTitle, children: [
              ContentTile(icon: Icons.copyright, title: t.about.licenses(n: 1), children: getCopyrightText(context)),
              ListTile(
                leading: const Icon(Icons.privacy_tip_outlined),
                title: Text(t.about.privacyPolicy),
                onTap: () => launchUrlString(buildConfig.dataPrivacyPolicyUrl, mode: LaunchMode.externalApplication),
              ),
              ListTile(
                leading: const Icon(Icons.accessibility_new_outlined),
                title: Text(t.about.accessibilityPolicy),
                onTap: () => launchUrlString(accessibilityPolicyUrl, mode: LaunchMode.externalApplication),
              ),
              ContentTile(
                icon: Icons.info_outline,
                title: t.about.disclaimer,
                children: getDisclaimerText(context),
              ),
              ListTile(
                leading: const Icon(Icons.book_outlined),
                title: Text(t.about.dependencies),
                onTap: () {
                  Navigator.of(context, rootNavigator: true).push(
                    AppRoute(
                      builder: (context) => const CustomLicensePage(),
                    ),
                  );
                },
              ),
              ListTile(
                leading: const Icon(Icons.code_outlined),
                title: Text(t.about.sourceCode),
                onTap: () {
                  launchUrlString(
                    'https://github.com/digitalfabrik/entitlementcard',
                    mode: LaunchMode.externalApplication,
                  );
                },
              ),
            ]),
            if (config.showDevSettings)
              Column(
                children: [
                  const Divider(
                    height: 1,
                    thickness: 1,
                  ),
                  ListTile(
                    leading: const Icon(Icons.build),
                    title: Text(t.about.developmentOptions),
                    onTap: () => showDialog(
                      context: context,
                      builder: (context) =>
                          SimpleDialog(title: Text(t.about.developmentOptions), children: [DevSettingsView()]),
                    ),
                  )
                ],
              )
          ];
        } else {
          children = [];
        }
        return ListView(children: children);
      },
    );
  }

  activateDialog(BuildContext context) {
    setState(() {
      clickCount += 1;
    });
    if (clickCount == widget.countToEnableSwitch) {
      setState(() {
        clickCount = 0;
      });
      BackendSwitchDialog.show(context);
    }
  }
}
