import 'package:flutter/foundation.dart';

import 'card_details.dart';
import 'persistence/card_details_store.dart';

class CardDetailsModel extends ChangeNotifier {
  CardDetails _cardDetails;
  bool _isInitialized = false;

  CardDetails get cardDetails {
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

  void setCardDetails(CardDetails details) {
    _cardDetails = details;
    saveCardDetails(details);
    notifyListeners();
  }

  void clearCardDetails() {
    _cardDetails = null;
    saveCardDetails(null);
    notifyListeners();
  }
}
