import 'verification_card_details_model.dart';
import 'verification_error.dart';
import 'verification_hasher.dart';

Future<void> verifyCardValidWithRemote(
    VerificationCardDetailsModel model) async {
  try {
    await Future.delayed(const Duration(seconds: 2), () => "2");
    final hash = hashVerificationCardDetails(model.verificationCardDetails);
    print("Verification hash: $hash");
    model.setVerificationSuccessful();
  } on Exception catch (e) {
    print("verifyCardValidWithRemote failed with unexpected "
        "error: ${e.toString()}");
    model.setVerificationFailure(VerificationError.fromStrings(
        "Ein unerwarteter Fehler ist aufgetreten", "#genVerErr"));
  }
}
