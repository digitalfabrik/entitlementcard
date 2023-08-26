import 'package:ehrenamtskarte/identification/activation_workflow/activate_code.dart';

class ActivationInvalidTotpSecretException extends ServerCardActivationException {
  const ActivationInvalidTotpSecretException() : super('Server failed to create totp secret for the scanned code.');
}

class ActivationDidNotOverwriteExisting implements Exception {
  const ActivationDidNotOverwriteExisting() : super();
}
