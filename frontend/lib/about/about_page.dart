import 'package:flutter/material.dart';
import 'package:package_info/package_info.dart';
import 'package:url_launcher/url_launcher.dart';

import '../configuration/configuration.dart';
import '../util/non_material_page.dart';
import 'content_tile.dart';
import 'dev_settings_view.dart';
import 'texts.dart';

class AboutPage extends StatelessWidget {
  const AboutPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final config = Configuration.of(context);

    return NonMaterialPage(
      overlayStyle: null,
      child: FutureBuilder<PackageInfo>(
          future: PackageInfo.fromPlatform(),
          builder: (context, snapshot) {
            List<Widget> children;
            var packageInfo = snapshot.data;
            if (snapshot.hasData && packageInfo != null) {
              children = [
                Container(height: 20),
                Center(
                  child: Padding(
                    padding: const EdgeInsets.all(10),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(20.0),
                      child: const Image(
                        image: AssetImage("assets/icon/icon.png"),
                        height: 100.0,
                        width: 100.0,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                ),
                Center(
                  child: Text(packageInfo.appName,
                      style: Theme.of(context).textTheme.headline5),
                ),
                Center(
                  child: Text(packageInfo.version,
                      style: Theme.of(context).textTheme.bodyText2),
                ),
                const Divider(
                  height: 40,
                  thickness: 1,
                ),
                InkWell(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        Center(
                          child: Text("Herausgeber",
                              style: Theme.of(context).textTheme.subtitle2),
                        ),
                        Padding(
                          padding: const EdgeInsets.only(
                              left: 10, right: 10, top: 10),
                          child: Text(publisherAddress,
                              style: Theme.of(context).textTheme.bodyText1),
                        ),
                        Text(
                          "Mehr Informationen",
                          style: Theme.of(context).textTheme.bodyText2?.merge(
                              TextStyle(
                                  color:
                                      Theme.of(context).colorScheme.secondary)),
                        ),
                      ],
                    ),
                  ),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => ContentPage(
                            title: "Herausgeber",
                            children: getPublisherText(context)),
                      ),
                    );
                  },
                ),
                const Divider(
                  height: 40,
                  thickness: 1,
                ),
                ContentTile(
                    icon: Icons.copyright,
                    title: "Lizenz",
                    children: getCopyrightText(context)),
                ContentTile(
                    icon: Icons.privacy_tip_outlined,
                    title: "Datenschutzerklärung",
                    children: getDataPrivacyText(context)),
                ContentTile(
                    icon: Icons.info_outline,
                    title: "Haftung, Haftungsausschluss und Disclaimer",
                    children: getDisclaimerText(context)),
                ListTile(
                    leading: const Icon(Icons.book_outlined),
                    title: const Text("Software-Bibliotheken"),
                    onTap: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const LicensePage(),
                          ));
                    }),
                ListTile(
                    leading: const Icon(Icons.code_outlined),
                    title: const Text("Quellcode der App"),
                    onTap: () {
                      launch(
                          "https://github.com/ehrenamtskarte/ehrenamtskarte");
                    }),
                if (config.showDevSettings)
                  ListTile(
                    leading: const Icon(Icons.build),
                    title: const Text("Entwickleroptionen"),
                    onTap: () => showDialog(
                      context: context,
                      builder: (context) => const SimpleDialog(
                          title: Text("Entwickleroptionen"),
                          children: [DevSettingsView()]),
                    ),
                  )
              ];
            } else {
              children = [];
            }
            return ListView(children: children);
          }),
    );
  }
}
