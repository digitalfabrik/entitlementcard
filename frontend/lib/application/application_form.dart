import 'package:ehrenamtskarte/application/send_application.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'card_type_step.dart';
import 'entitlement_step.dart';
import 'entitlement_type_step.dart';
import 'personal_data_step.dart';
import 'region_step.dart';
import 'summary_step.dart';
import 'textwidgets/step_title_text.dart';

class ApplicationForm extends StatefulWidget {
  @override
  _ApplicationFormState createState() => _ApplicationFormState();
}

class _ApplicationFormState extends State<ApplicationForm> {
  static final _lastStep = 5;
  int _currentStep = 0;
  final _formKeys = List<GlobalKey<FormBuilderState>>.generate(
      _lastStep + 1, (index) => GlobalKey<FormBuilderState>());
  bool _sendingInProgress = false;
  bool _sendingSuccessful = false;

  GraphQLClient _client;

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
    return Scaffold(
        appBar: AppBar(title: Text("Ehrenamtskarte beantragen")),
        body: Stepper(
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
                          style: TextButton.styleFrom(
                            primary: Theme.of(context).colorScheme.onPrimary,
                            backgroundColor:
                                Theme.of(context).colorScheme.primary,
                            padding: EdgeInsets.all(12),
                            shape: RoundedRectangleBorder(
                                borderRadius:
                                    BorderRadius.all(Radius.circular(4))),
                          )),
                    SizedBox(
                      width: 12,
                    ),
                    TextButton(
                        onPressed: onStepContinue,
                        child: Text(
                            _currentStep < _lastStep ? 'WEITER' : 'ABSENDEN'),
                        style: TextButton.styleFrom(
                          primary: Theme.of(context).colorScheme.onPrimary,
                          backgroundColor:
                              Theme.of(context).colorScheme.primary,
                          padding: EdgeInsets.all(12),
                          shape: RoundedRectangleBorder(
                              borderRadius:
                                  BorderRadius.all(Radius.circular(4))),
                        )),
                  ],
                ),
              );
            },
            steps: [
              Step(
                title: StepTitleText(title: 'Region'),
                content: RegionStep(
                  formKey: _formKeys[0],
                ),
                isActive: _currentStep >= 0,
                state:
                    _currentStep >= 1 ? StepState.complete : StepState.disabled,
              ),
              Step(
                title: StepTitleText(title: 'Kartentyp'),
                content: CardTypeStep(
                  formKey: _formKeys[1],
                ),
                isActive: _currentStep >= 0,
                state:
                    _currentStep >= 2 ? StepState.complete : StepState.disabled,
              ),
              Step(
                title: StepTitleText(title: 'Voraussetzungen'),
                content: EntitlementTypeStep(
                  formKey: _formKeys[2],
                ),
                isActive: _currentStep >= 0,
                state:
                    _currentStep >= 3 ? StepState.complete : StepState.disabled,
              ),
              Step(
                title: StepTitleText(title: 'Persönliche Daten'),
                content: PersonalDataStep(
                  formKey: _formKeys[3],
                ),
                isActive: _currentStep >= 0,
                state:
                    _currentStep >= 4 ? StepState.complete : StepState.disabled,
              ),
              Step(
                title: StepTitleText(title: 'Tätigkeitsnachweis'),
                content: EntitlementStep(
                  formKey: _formKeys[4],
                ),
                isActive: _currentStep >= 0,
                state:
                    _currentStep >= 5 ? StepState.complete : StepState.disabled,
              ),
              Step(
                title: StepTitleText(title: 'Abschluss'),
                content: SummaryStep(formKey: _formKeys[5]),
                isActive: _currentStep >= 0,
                state:
                    _currentStep >= 6 ? StepState.complete : StepState.disabled,
              ),
            ]));
  }

  _onStepTapped(step) {
    setState(() => _currentStep = step);
  }

  _onStepContinued() {
    if (_formKeys[_currentStep].currentState.validate()) {
      _formKeys[_currentStep].currentState.save();
      if (_currentStep < _lastStep) {
        setState(() => _currentStep++);
      } else if (!_sendingInProgress) {
        _sendingInProgress = true;
        _sendApplication();
      }
    }
  }

  _onStepCancel() {
    _currentStep > 0 ? setState(() => _currentStep -= 1) : null;
  }

  _sendApplication() {
    final sendApplication =
        SendApplication(key: UniqueKey(), onResult: _onApplicationResult);
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

  void _onApplicationResult(bool success) {
    _sendingSuccessful = success;
  }
}
