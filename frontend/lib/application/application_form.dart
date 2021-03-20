import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:provider/provider.dart';

import '../graphql/graphql_api.dart';
import 'application_model.dart';
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
  static const _lastStep = 5;
  final _formKeys = List<GlobalKey<FormBuilderState>>.generate(
      _lastStep + 1, (index) => GlobalKey<FormBuilderState>());
  int _currentStep = 0;
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

  void _onStepTapped(int step) {
    setState(() => _currentStep = step);
  }

  void _onStepContinued() {
    if (_formKeys[_currentStep].currentState.validate()) {
      _formKeys[_currentStep].currentState.save();
      if (_currentStep < _lastStep) {
        setState(() => _currentStep++);
      } else {
        _sendApplication();
      }
    }
  }

  void _onStepCancel() {
    _currentStep > 0 ? setState(() => _currentStep -= 1) : null;
  }

  void _sendApplication() async {
    final applicationModel =
        Provider.of<ApplicationModel>(context, listen: false);
    var query;
    if (applicationModel.hasBlueCardApplication()) {
      var application = AddBlueEakApplicationArguments(
          application: applicationModel.blueCardApplication,
          regionId: applicationModel.regionId);
      query = AddBlueEakApplicationMutation(variables: application);
    } else if (applicationModel.hasGoldCardApplication()) {
      var application = AddGoldenEakApplicationArguments(
          application: applicationModel.goldenCardApplication,
          regionId: applicationModel.regionId);
      query = AddGoldenEakApplicationMutation(variables: application);
    }

    final result = await _client.query(QueryOptions(
        document: query.document, variables: query.getVariablesMap()));
    if (result.hasException) throw result.exception;
    Navigator.of(context).pop();
  }
}
