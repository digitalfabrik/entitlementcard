import 'package:flutter/foundation.dart';

import 'persistence/personal_card_details_store.dart';
import 'personal_card_details.dart';

class PersonalCardDetailsModel extends ChangeNotifier {
  PersonalCardDetails _cardDetails;
  bool _isInitialized = false;

  PersonalCardDetails get cardDetails {
    return _cardDetails;
  }

  Future<void> initialize() async {
    if (_isInitialized) {
      return;
    }
    _cardDetails = await loadCardDetails();
    _isInitialized = true;
    notifyListeners();
  }

  void setPersonalCardDetails(PersonalCardDetails details) {
    _cardDetails = details;
    saveCardDetails(details);
    notifyListeners();
  }

  void clearPersonalCardDetails() {
    _cardDetails = null;
    saveCardDetails(null);
    notifyListeners();
  }
}
