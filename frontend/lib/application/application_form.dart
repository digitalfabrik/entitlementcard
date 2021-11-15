import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'card_type_step.dart';
import 'entitlement_step.dart';
import 'entitlement_type_step.dart';
import 'personal_data_step.dart';
import 'region_step.dart';
import 'send_application.dart';
import 'summary_step.dart';
import 'textwidgets/step_title_text.dart';

class ApplicationForm extends StatefulWidget {
  const ApplicationForm({Key? key}) : super(key: key);

  @override
  _ApplicationFormState createState() => _ApplicationFormState();
}

class _ApplicationFormState extends State<ApplicationForm> {
  static const _lastStep = 5;
  final _formKeys = List<GlobalKey<FormBuilderState>>.generate(
      _lastStep + 1, (index) => GlobalKey<FormBuilderState>());
  bool _sendingInProgress = false;
  bool _sendingSuccessful = false;

  int _currentStep = 0;
  GraphQLClient? _client;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final client = GraphQLProvider.of(context).value;
    assert(client != null);
    if (client != _client) {
      _client = client;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Expanded(
        child: Column(children: [
      AppBar(
        backgroundColor: Colors.transparent,
        title: const Text("Karte beantragen"),
      ),
      Expanded(
          child: Stepper(
              currentStep: _currentStep,
              onStepContinue: _onStepContinued,
              onStepCancel: _onStepCancel,
              type: StepperType.vertical,
              onStepTapped: _onStepTapped,
              controlsBuilder: (context, {onStepContinue, onStepCancel}) {
                return Padding(
                  padding: const EdgeInsets.only(top: 16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: <Widget>[
                      if (_currentStep > 0)
                        TextButton(
                          onPressed: onStepCancel,
                          child: const Text('ZURÜCK'),
                        ),
                      const SizedBox(width: 12),
                      TextButton(
                        onPressed: onStepContinue,
                        child: Text(
                            _currentStep < _lastStep ? 'WEITER' : 'ABSENDEN'),
                      ),
                    ],
                  ),
                );
              },
              steps: [
            _buildStep(
                'Region',
                0,
                (key) => RegionStep(
                      formKey: key,
                    )),
            _buildStep('Kartentyp', 1, (key) => CardTypeStep(formKey: key)),
            _buildStep('Voraussetzungen', 2,
                (key) => EntitlementTypeStep(formKey: key)),
            _buildStep('Persönliche Daten', 3,
                (key) => PersonalDataStep(formKey: key)),
            _buildStep('Tätigkeitsnachweis', 4,
                (key) => EntitlementStep(formKey: key)),
            _buildStep('Abschluss', 5, (key) => SummaryStep(formKey: key)),
          ]))
    ]));
  }

  _buildStep(String title, int index,
          Widget Function(GlobalKey<FormBuilderState> key) formBuilder) =>
      Step(
          title: StepTitleText(title: title),
          content: formBuilder(_formKeys[index]),
          isActive: _currentStep >= 0,
          state: _getStepState(index));

  _getStepState(index) => _currentStep > index
      ? (_formKeys[index].currentState?.validate() ?? true)
          ? StepState.complete
          : StepState.error
      : _currentStep == index
          ? StepState.editing
          : StepState.indexed;

  void _onStepTapped(int step) {
    // can go forward by tapping only if the forms in between are valid
    if (step > _currentStep) {
      for (var i = _currentStep; i < step; i++) {
        var currentState = _formKeys[i].currentState;

        if (currentState == null) {
          continue;
        }

        if (!currentState.validate()) return;
        if (i == _currentStep) {
          currentState.save();
        }
      }
    }
    setState(() => _currentStep = step);
  }

  void _onStepContinued() {
    var currentState = _formKeys[_currentStep].currentState;
    if (currentState == null) {
      return;
    }

    if (currentState.validate()) {
      currentState.save();
      if (_currentStep < _lastStep) {
        setState(() => _currentStep++);
      } else if (!_sendingInProgress) {
        _sendingInProgress = true;
        _sendApplication();
      }
    }
  }

  void _onStepCancel() {
    _currentStep > 0 ? setState(() => _currentStep -= 1) : null;
  }

  void _sendApplication() {
    final sendApplication = SendApplication(
      key: UniqueKey(),
      onResult: (success) => _sendingSuccessful = success,
    );
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: sendApplication))
        .closed
        .then((value) => {
              if (_sendingSuccessful)
                {Navigator.of(context).pop()}
              else
                {_sendingInProgress = false}
            });
  }
}
