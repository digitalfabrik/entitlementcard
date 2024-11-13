# Flutter App for Android and iOS

## Development

### Flutter Installation

To install FVM and the project Flutter version
* Run the command `flutter pub global activate fvm`.
* If not already done, you might need to add some flutter directory to your PATH environment. The above command will
  notify you if this is the case.
* Make sure you are located in the `frontend` directory. Run `fvm install` to install the correct Flutter version (as
  specified in `.fvm/fvm_config.json`).
* For IntelliJ support, select the new Flutter Sdk by:
    * Open `Settings > Languages & Frameworks > Flutter`.
    * Change the Flutter Sdk Path to `(project-directory)/frontend/.fvm/flutter_sdk`.

Once installed, you can run any flutter command simply by prefixing it with `fvm`, e.g. `fvm flutter pub get`

To upgrade the flutter version
* Run `fvm use x.y.z`
* Adjust the version specified in `pubspec.yaml`.

To disable analytics by flutter run:
* `fvm flutter config --no-analytics`
