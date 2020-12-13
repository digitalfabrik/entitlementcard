import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class DetailLayout extends StatelessWidget {
  final String title;
  final Widget body;
  final int category;

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
    String path;
    print("CATEGORY: ${category}");
    switch (category) {
      case (1):
        path = "assets/detail_headers/1_auto.svg";
        break;
      case (2):
        path = "assets/detail_headers/2_multimedia.svg";
        break;
      case (3):
        path = "assets/detail_headers/3_sport.svg";
        break;
      case (4):
        path = "assets/detail_headers/4_kultur.svg";
        break;
      case (5):
        path = "assets/detail_headers/5_finanzen.svg";
        break;
      case (6):
        path = "assets/detail_headers/6_mode.svg";
        break;
      case (7):
        path = "assets/detail_headers/7_haus.svg";
        break;
      case (8):
        path = "assets/detail_headers/8_freizeit.svg";
        break;
      case (9):
        path = "assets/detail_headers/9_essen.svg";
        break;
      default:
        return null;
    }
    return SvgPicture.asset(
      path,
      semanticsLabel: 'Header',
      alignment: Alignment.bottomRight,
    );
  }
}
