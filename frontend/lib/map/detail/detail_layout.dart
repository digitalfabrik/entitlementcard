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
          flexibleSpace: Image(
              image: AssetImage(headerImageOfCategory(this.category)),
              fit: BoxFit.contain,
              alignment: Alignment.topRight),
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

  String headerImageOfCategory(int category) {
    switch (category) {
      default:
        return "assets/detail_headers/category_1.png";
    }
  }
}
