import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'verification_card_details_model.dart';
import 'view/verification_view.dart';

class VerificationPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(providers: [
      ChangeNotifierProvider(
          create: (context) => VerificationCardDetailsModel()),
    ], child: VerificationView());
  }
}
