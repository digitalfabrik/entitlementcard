import 'package:ehrenamtskarte/about/backend_switch_dialog.dart';
import 'package:ehrenamtskarte/about/content_tile.dart';
import 'package:ehrenamtskarte/about/dev_settings_view.dart';
import 'package:ehrenamtskarte/about/license_page.dart';
import 'package:ehrenamtskarte/about/texts.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/routing.dart';
import 'package:flutter/material.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:url_launcher/url_launcher_string.dart';

import '../util/l10n.dart';

class AboutPage extends StatefulWidget {
  final countToEnableSwitch = 10;

  const AboutPage({super.key});

  @override
  AboutPageState createState() => AboutPageState();
}

class AboutPageState extends State<AboutPage> {
  int clickCount = 0;

  @override
  Widget build(BuildContext context) {
    final config = Configuration.of(context);

    return FutureBuilder<PackageInfo>(
      future: PackageInfo.fromPlatform(),
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
              child: Text(packageInfo.appName, style: Theme.of(context).textTheme.headlineSmall),
            ),
            Center(
              child: Text(packageInfo.version, style: Theme.of(context).textTheme.bodyMedium),
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
                      child: Text(context.l10n.about_publisher, style: Theme.of(context).textTheme.titleSmall),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(left: 10, right: 10, top: 16, bottom: 16),
                      child: Text(buildConfig.publisherAddress, style: Theme.of(context).textTheme.bodyLarge),
                    ),
                    Text(
                      context.l10n.about_moreInformation,
                      style: Theme.of(context)
                          .textTheme
                          .bodyMedium
                          ?.merge(TextStyle(color: Theme.of(context).colorScheme.secondary)),
                    ),
                  ],
                ),
              ),
              onTap: () {
                Navigator.push(
                  context,
                  AppRoute(
                    builder: (context) =>
                        ContentPage(title: context.l10n.about_publisher, children: getPublisherText(context)),
                  ),
                );
              },
            ),
            const Divider(
              height: 1,
              thickness: 1,
            ),
            const SizedBox(height: 20),
            ContentTile(icon: Icons.copyright, title: context.l10n.about_license, children: getCopyrightText(context)),
            ListTile(
              leading: const Icon(Icons.privacy_tip_outlined),
              title: Text(context.l10n.about_privacyDeclaration),
              onTap: () => launchUrlString(buildConfig.dataPrivacyPolicyUrl, mode: LaunchMode.externalApplication),
            ),
            ContentTile(
              icon: Icons.info_outline,
              title: context.l10n.about_disclaimer,
              children: getDisclaimerText(context),
            ),
            ListTile(
              leading: const Icon(Icons.book_outlined),
              title: Text(context.l10n.about_dependencies),
              onTap: () {
                Navigator.push(
                  context,
                  AppRoute(
                    builder: (context) => const CustomLicensePage(),
                  ),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.code_outlined),
              title: Text(context.l10n.about_sourceCode),
              onTap: () {
                launchUrlString(
                  'https://github.com/digitalfabrik/entitlementcard',
                  mode: LaunchMode.externalApplication,
                );
              },
            ),
            if (config.showDevSettings)
              ListTile(
                leading: const Icon(Icons.build),
                title: Text(context.l10n.about_developmentOptions),
                onTap: () => showDialog(
                  context: context,
                  builder: (context) =>
                      SimpleDialog(title: Text(context.l10n.about_developmentOptions), children: [DevSettingsView()]),
                ),
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
