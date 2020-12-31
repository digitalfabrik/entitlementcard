import '../card_details.dart';
import 'package:shared_preferences/shared_preferences.dart';

const FIRST_NAME = "firstName";
const LAST_NAME = "lastName";
const REGION = "region";
const EXPIRATION_DATE = "expirationDate";

Future<void> saveCardDetails(CardDetails cardDetails) async {
  final store = await SharedPreferences.getInstance();
  List<Future<bool>> futures = [];
  if (cardDetails != null) {
    futures.add(store.setString(FIRST_NAME, cardDetails.firstName));
    futures.add(store.setString(LAST_NAME, cardDetails.lastName));
    futures.add(store.setString(REGION, cardDetails.region));
    futures.add(store.setString(
        EXPIRATION_DATE, cardDetails.expirationDate.toIso8601String()));
  } else {
    futures.add(store.remove(FIRST_NAME));
    futures.add(store.remove(LAST_NAME));
    futures.add(store.remove(REGION));
    futures.add(store.remove(EXPIRATION_DATE));
  }
  await Future.wait(futures);
}

Future<CardDetails> loadCardDetails() async {
  final store = await SharedPreferences.getInstance();
  if (!(store.containsKey(FIRST_NAME) &&
      store.containsKey(LAST_NAME) &&
      store.containsKey(REGION) &&
      store.containsKey(EXPIRATION_DATE))) {
    print("loadCardDetails(): Store does not contain card details!");
    return null;
  }
  final firstName = store.getString(FIRST_NAME);
  final lastName = store.getString(LAST_NAME);
  final region = store.getString(REGION);
  final expirationDate = DateTime.parse(store.getString(EXPIRATION_DATE));
  return CardDetails(firstName, lastName, expirationDate, region);
}
