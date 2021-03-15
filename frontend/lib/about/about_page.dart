import 'package:flutter/material.dart';
import 'package:package_info/package_info.dart';

import 'content_tile.dart';
import 'texts.dart';

class AboutPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: FutureBuilder<PackageInfo>(
            future: PackageInfo.fromPlatform(),
            builder: (context, snapshot) {
              List<Widget> children;
              if (snapshot.hasData) {
                children = [
                  Container(height: 20),
                  Center(
                      child: Padding(
                          padding: EdgeInsets.all(10),
                          child: ClipRRect(
                              borderRadius: BorderRadius.circular(20.0),
                              child: Image(
                                image: AssetImage("assets/icon/icon.png"),
                                height: 100.0,
                                width: 100.0,
                                fit: BoxFit.cover,
                              )))),
                  Center(
                      child: Text(snapshot.data.appName,
                          style: Theme.of(context).textTheme.headline5)),
                  Center(
                      child: Text(snapshot.data.version,
                          style: Theme.of(context).textTheme.bodyText2)),
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
                                  style:
                                      Theme.of(context).textTheme.subtitle2)),
                          Padding(
                              padding:
                                  EdgeInsets.only(left: 10, right: 10, top: 10),
                              child: Text(publisherAddress,
                                  style:
                                      Theme.of(context).textTheme.bodyText1)),
                          Text("Mehr Informationen",
                              style: Theme.of(context)
                                  .textTheme
                                  .bodyText2
                                  .merge(TextStyle(
                                      color: Theme.of(context).primaryColor))),
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
                          ));
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
                      leading: Icon(Icons.book_outlined),
                      title: Text("Software-Bibliotheken"),
                      onTap: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => LicensePage(),
                            ));
                      })
                ];
              } else {
                children = [];
              }
              return ListView(children: children);
            }));
  }
}
