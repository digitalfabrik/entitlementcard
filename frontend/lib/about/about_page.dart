import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:package_info/package_info.dart';
import '../identification/testing_data_item.dart';

class AboutPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ListView(children: [
      Container(child: ClipRRect(
          borderRadius: const BorderRadius.all(Radius.zero),
        child: SvgPicture.asset("assets/app_icon/icon.svg",
            semanticsLabel: "App icon", width: 120)
      )),
    ]);
  }

  void _showAboutDialog(context) {
    PackageInfo.fromPlatform().then((packageInfo) =>
        showAboutDialog(
          context: context,
          applicationIcon: ClipRRect(
            child: SvgPicture.asset("assets/app_icon/icon.svg",
                semanticsLabel: "App icon", width: 30),
            borderRadius: BorderRadius.all(Radius.circular(5)),
          ),
          applicationName: packageInfo.appName,
          applicationVersion: packageInfo.version,
          applicationLegalese: 'Copyright Ehrenamtskarten Kompetenzteam',
        ));
  }
}
