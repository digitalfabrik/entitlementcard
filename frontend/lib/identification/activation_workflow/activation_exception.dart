import 'package:ehrenamtskarte/identification/activation_workflow/activate_code.dart';

class ActivationInvalidTotpSecretException extends ServerCardActivationException {
  const ActivationInvalidTotpSecretException()
      : super('Der Server konnte kein TotpSecret für den eingescannten QRCode generieren.');
}

class ActivationDidNotOverwriteExisting implements Exception {
  const ActivationDidNotOverwriteExisting() : super();

  @override
  String toString() {
    return 'Der eingescannte QRCode wurde bereits aktiviert.';
  }
}
