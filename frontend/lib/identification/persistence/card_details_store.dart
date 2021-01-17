import 'package:shared_preferences/shared_preferences.dart';

import '../card_details.dart';

const fullNameKey = "fullName";
const randomBytesKey = "randomBytes";
const expirationDateKey = "expirationDate";
const totpSecretKey = "totpSecret";
const cardTypeKey = "cardType";
const regionKey = "region";

Future<void> saveCardDetails(CardDetails cardDetails) async {
  final store = await SharedPreferences.getInstance();
  var futures = <Future<bool>>[];
  if (cardDetails != null) {
    futures.add(store.setString(fullNameKey, cardDetails.fullName));
    futures.add(store.setString(randomBytesKey, cardDetails.randomBytes));
    futures.add(store.setInt(expirationDateKey, cardDetails.expirationDate));
    futures.add(store.setString(totpSecretKey, cardDetails.totpSecret));
    futures.add(store.setString(cardTypeKey, cardDetails.cardType));
    futures.add(store.setString(regionKey, cardDetails.region));
  } else {
    futures.add(store.remove(fullNameKey));
    futures.add(store.remove(randomBytesKey));
    futures.add(store.remove(expirationDateKey));
    futures.add(store.remove(totpSecretKey));
    futures.add(store.remove(cardTypeKey));
    futures.add(store.remove(regionKey));
  }
  await Future.wait(futures);
}

Future<CardDetails> loadCardDetails() async {
  final store = await SharedPreferences.getInstance();
  if (!(store.containsKey(fullNameKey) &&
      store.containsKey(regionKey) &&
      store.containsKey(expirationDateKey))) {
    print("loadCardDetails(): Store does not contain card details!");
    return null;
  }
  final fullName = store.getString(fullNameKey);
  final randomBytes = store.get(randomBytesKey);
  final expirationDate = store.getInt(expirationDateKey);
  final totpSecret = store.get(totpSecretKey);
  final cardType = store.getString(cardTypeKey);
  final region = store.getString(regionKey);
  return CardDetails(
      fullName: fullName,
      randomBytes: randomBytes,
      expirationDate: expirationDate,
      totpSecret: totpSecret,
      cardType: cardType,
      region: region);
}
