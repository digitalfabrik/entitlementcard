import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

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
              preferredSize: Size.fromHeight(70.0),
              child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  alignment: Alignment.bottomLeft,
                  child: Text(
                    title,
                    style: Theme.of(context).textTheme.headline6,
                  ))),
          backgroundColor: Theme.of(context).primaryColorLight,
          elevation: 0.0, //No shadow
        ),
        body: SingleChildScrollView(
          child: body,
        ));
  }

  Image _headerImageForCategory() {
    String path;
    print("CATEGORY: ${category}");
    switch (category) {
      case (1):
        path = "assets/detail_headers/1_auto.png";
        break;
      case (2):
        path = "assets/detail_headers/2_multimedia.png";
        break;
      case (3):
        path = "assets/detail_headers/3_sport.png";
        break;
      case (4):
        path = "assets/detail_headers/4_kultur.png";
        break;
      case (5):
        path = "assets/detail_headers/5_finanzen.png";
        break;
      case (6):
        path = "assets/detail_headers/6_mode.png";
        break;
      case (7):
        path = "assets/detail_headers/7_haus.png";
        break;
      case (8):
        path = "assets/detail_headers/8_freizeit.png";
        break;
      case (9):
        path = "assets/detail_headers/9_essen.png";
        break;
      default:
        return null;
    }
    return Image(
        image: AssetImage(path),
        fit: BoxFit.contain,
        alignment: Alignment.topRight);
  }
}
