import 'package:ehrenamtskarte/graphql/wrapper.dart';
import 'package:flutter/material.dart';
import 'acceping_businesses_repository.dart';
import 'app.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  runApp(GraphQLWrapper(child: App(repository: AcceptingBusinessesRepository())));
}
