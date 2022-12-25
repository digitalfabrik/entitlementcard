# Flutter App for Android and iOS

## Development

### Flutter Installation

To install FVM and the project Flutter version
* Run the command `flutter pub global activate fvm`.
* If not already done, you might need to add some flutter directory to your PATH environment. The above command will
  notify you if this is the case.
* Make sure you are located in the `frontend` directory. Run `fvm install` to install the correct Flutter version (as
  specified in `.fvm/fvm_config.json`).
* Install the protobuf dart generator plugin: `fvm flutter pub global activate protoc_plugin`.
  * After that, when running `build_runner`, you might still encounter the following error:

        Call: "protoc", ["--plugin=protoc-gen-dart=[YOUR_HOME_DIR]/.pub-cache/bin/protoc-gen-dart","--dart_out=lib/proto/","./card.proto"]
        Standard error output:
        [YOUR_HOME_DIR]/.pub-cache/bin/protoc-gen-dart: program not found or is not executable
        Please specify a program using absolute path or make sure the program is available in your PATH system variable
        --dart_out: protoc-gen-dart: Plugin failed with status code 1.`

    We are unsure why/when this error occurs. Usually, it is solved by a combination of:
    * Make sure `protoc --plugin=protoc-gen-dart=[YOUR_HOME_DIR]/.pub-cache/bin/protoc-gen-dart --dart_out=lib/proto/ ./card.proto` runs successfully. (Replace `YOUR_HOME_DIR` with your home directory).
    * Remove the `build` and `build_resolvers` folders of the `.dart_tool` folder.
    * Reboot your system.
* For IntelliJ support, select the new Flutter Sdk by:
    * Open `Settings > Languages & Frameworks > Flutter`.
    * Change the Flutter Sdk Path to `(project-directory)/frontend/.fvm/flutter_sdk`.

Once installed, you can run any flutter command simply by prefixing it with `fvm`, e.g. `fvm flutter pub get`

To upgrade the flutter version
* Run `fvm use x.y.z`
* Adjust the version specified in `pubspec.yaml`.

To disable analytics by flutter run:
* `fvm flutter config --no-analytics`
