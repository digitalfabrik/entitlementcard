import 'package:ehrenamtskarte/more/testing_data_item.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:package_info/package_info.dart';

import 'menu_item.dart';

const SHOW_TEST_DATA_OPTIONS =
    bool.fromEnvironment("test_data_options", defaultValue: false);

class MorePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.dark,
      child: SingleChildScrollView(
        padding: EdgeInsets.symmetric(vertical: 24, horizontal: 18),
        child: GridView.count(crossAxisCount: 2, shrinkWrap: true, children: [
          MenuItem(
            title: 'Über diese App',
            icon: Icons.info_outline,
            callback: () => _showAboutDialog(context),
          ),
          if (SHOW_TEST_DATA_OPTIONS) TestingDataItem(),
        ]),
      ),
    );
  }

  void _showAboutDialog(context) {
    PackageInfo.fromPlatform().then((packageInfo) => showAboutDialog(
          context: context,
          applicationIcon: ClipRRect(
            child: SvgPicture.asset("assets/app_icon/icon_ios.svg",
                semanticsLabel: "App icon", width: 30),
            borderRadius: BorderRadius.all(Radius.circular(5)),
          ),
          applicationName: packageInfo.appName,
          applicationVersion: packageInfo.version,
          applicationLegalese: 'Copyright Ehrenamtskarten Kompetenzteam',
        ));
  }
}
