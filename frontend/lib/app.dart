import 'package:ehrenamtskarte/acceping_businesses_repository.dart';
import 'package:ehrenamtskarte/accepting_businesses_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'home_page.dart';

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
            visualDensity: VisualDensity.adaptivePlatformDensity),
        home: HomePage(title: "Digitale Ehrenamstkarte"),
        routes: {
          'home': (context) => HomePage(title: "Digitale Ehrenamstkarte"),
          'home1': (context) => HomePage(title: "Digitale Ehrenamstkarte")
        },
      ),
    );
  }
}
