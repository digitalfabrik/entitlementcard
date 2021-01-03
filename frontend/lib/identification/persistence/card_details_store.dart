import 'package:shared_preferences/shared_preferences.dart';

import '../card_details.dart';

const firstNameKey = "firstName";
const lastNameKey = "lastName";
const regionKey = "region";
const expirationDateKey = "expirationDate";

Future<void> saveCardDetails(CardDetails cardDetails) async {
  final store = await SharedPreferences.getInstance();
  var futures = <Future<bool>>[];
  if (cardDetails != null) {
    futures.add(store.setString(firstNameKey, cardDetails.firstName));
    futures.add(store.setString(lastNameKey, cardDetails.lastName));
    futures.add(store.setString(regionKey, cardDetails.region));
    futures.add(store.setString(
        expirationDateKey, cardDetails.expirationDate.toIso8601String()));
  } else {
    futures.add(store.remove(firstNameKey));
    futures.add(store.remove(lastNameKey));
    futures.add(store.remove(regionKey));
    futures.add(store.remove(expirationDateKey));
  }
  await Future.wait(futures);
}

Future<CardDetails> loadCardDetails() async {
  final store = await SharedPreferences.getInstance();
  if (!(store.containsKey(firstNameKey) &&
      store.containsKey(lastNameKey) &&
      store.containsKey(regionKey) &&
      store.containsKey(expirationDateKey))) {
    print("loadCardDetails(): Store does not contain card details!");
    return null;
  }
  final firstName = store.getString(firstNameKey);
  final lastName = store.getString(lastNameKey);
  final region = store.getString(regionKey);
  final expirationDate = DateTime.parse(store.getString(expirationDateKey));
  return CardDetails(firstName, lastName, expirationDate, region);
}
