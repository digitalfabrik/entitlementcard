import 'package:ehrenamtskarte/identification/card_details.dart';
import 'package:ehrenamtskarte/identification/persistence/card_details_store.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> clearStoredData() async {
  final store = await SharedPreferences.getInstance();
  await store.clear();
}

Future<void> insertEAKTestData() async {
  final details = CardDetails(
      "Jane", "Doe", DateTime.parse("2024-03-22"), "Augsburg Stadt");
  await saveCardDetails(details);
}
