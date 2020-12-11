import 'package:ehrenamtskarte/models/accepting_businesses_model.dart';
import 'package:ehrenamtskarte/repositories/accepting_businesses_repository.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'home/home_page.dart';

class App extends StatelessWidget {
  final AcceptingBusinessesRepository repository;

  App({
    @required this.repository,
  });

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AcceptingBusinessesModel(repository: repository)
        ..loadAcceptingBusinesses(),
      child: MaterialApp(
        title: 'Digitale Ehrenamtskarte',
        theme: ThemeData(
            primarySwatch: Colors.blue,
            brightness: Brightness.light,
            visualDensity: VisualDensity.adaptivePlatformDensity,
            textTheme: TextTheme(
              headline6: TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold),
              bodyText1:
                  TextStyle(fontSize: 15.0, fontWeight: FontWeight.normal),
              bodyText2: TextStyle(fontSize: 15.0, color: Color(0xFF505050)),
            )),
        home: HomePage(title: "Digitale Ehrenamtskarte"),
        routes: {
          'home': (context) => HomePage(title: "Digitale Ehrenamstkarte"),
          'home1': (context) => HomePage(title: "Digitale Ehrenamstkarte")
        },
      ),
    );
  }
}
