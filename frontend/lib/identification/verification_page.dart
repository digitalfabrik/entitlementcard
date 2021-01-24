import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';

import '../verification/verification_card_details_model.dart';
import '../verification/verification_page.dart';

class VerificationPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(providers: [
      ChangeNotifierProvider(
          create: (context) => VerificationCardDetailsModel()),
    ], child: VerificationView());
  }
}
