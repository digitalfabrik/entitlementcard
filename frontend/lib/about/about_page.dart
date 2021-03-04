import 'package:flutter/material.dart';
import 'package:package_info/package_info.dart';

import 'copyright.dart';

class AboutPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: FutureBuilder<PackageInfo>(
            future: PackageInfo.fromPlatform(),
            builder:
                (BuildContext context, AsyncSnapshot<PackageInfo> snapshot) {
              List<Widget> children;
              if (snapshot.hasData) {
                children = [
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
                    height: 20,
                    thickness: 1,
                  ),
                  Center(
                      child: Text("Herausgeber",
                          style: Theme.of(context).textTheme.subtitle2)),
                  Padding(
                      padding: EdgeInsets.all(10),
                      child: Text(
                          'Bayerisches Staatsministerium für Familie, Arbeit und Soziales\nWinzererstraße 7\n80797 München',
                          style: Theme.of(context).textTheme.bodyText1)),
                  const Divider(
                    height: 20,
                    thickness: 1,
                  ),
                  ListTile(leading: Icon(Icons.copyright),
                      title: Text("sdf"), onTap: () => _showCopyright(context))
                ];
              } else {
                children = [];
              }
              return Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: children);
            }));
  }

  void _showCopyright(context) {
    Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => Copyright(),
        ));
  }
}
