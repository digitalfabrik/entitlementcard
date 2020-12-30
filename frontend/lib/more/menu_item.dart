import 'package:flutter/material.dart';

class MenuItem extends StatelessWidget {

  const MenuItem({Key key, this.title, this.icon, this.callback}) : super(key: key);

  final String title;

  final IconData icon;

  final GestureTapCallback callback;

  @override
  Widget build(BuildContext context) {
    return Card(
        child: Padding(
          padding: EdgeInsets.all(15.0),
            child: InkWell(
                child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(icon, size: 90.0),
                        Text(title)
                      ],
                    )
                ),
                onTap: callback
            )
        )
    );
  }

}
