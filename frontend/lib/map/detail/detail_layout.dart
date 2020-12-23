import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class DetailLayout extends StatelessWidget {
  final String title;
  final Widget body;
  final int category;

  static const List _imagePaths = [
    "assets/detail_headers/0_auto.svg",
    "assets/detail_headers/1_multimedia.svg",
    "assets/detail_headers/2_sport.svg",
    "assets/detail_headers/3_kultur.svg",
    "assets/detail_headers/4_finanzen.svg",
    "assets/detail_headers/5_mode.svg",
    "assets/detail_headers/6_haus.svg",
    "assets/detail_headers/7_freizeit.svg",
    "assets/detail_headers/8_essen.svg"
  ];

  DetailLayout({this.title, this.body, this.category});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          leading: new IconButton(
            icon: new Icon(
              Icons.arrow_back_ios,
              color: Theme.of(context).textTheme.bodyText1.color,
            ),
            onPressed: () => Navigator.of(context).pop(),
          ),
          flexibleSpace: _headerImageForCategory(),
          bottom: PreferredSize(
              preferredSize: Size.fromHeight(75.0),
              child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  alignment: Alignment.bottomLeft,
                  child: Text(
                    title,
                    style: Theme.of(context).textTheme.headline6,
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ))),
          backgroundColor: Theme.of(context).primaryColorLight,
          elevation: 0.0, //No shadow
        ),
        body: SingleChildScrollView(
          child: body,
        ));
  }

  Widget _headerImageForCategory() {
    if (category == null || category >= _imagePaths.length) {
      return null;
    }
    return SvgPicture.asset(
      _imagePaths[category],
      semanticsLabel: 'Header',
      alignment: Alignment.bottomRight,
    );
  }
}
