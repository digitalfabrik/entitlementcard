import 'package:flutter/material.dart';

import 'card_type_step.dart';
import 'entitlement_step.dart';
import 'organization_step.dart';
import 'personal_data_step.dart';
import 'summary_step.dart';

class ApplicationForm extends StatefulWidget {
  @override
  _ApplicationFormState createState() => _ApplicationFormState();
}

class _ApplicationFormState extends State<ApplicationForm> {
  int _currentStep = 0;
  final _lastStep = 4;

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Stepper(
          currentStep: _currentStep,
          onStepContinue: _onStepContinued,
          onStepCancel: _onStepCancel,
          type: StepperType.vertical,
          onStepTapped: _onStepTapped,
          controlsBuilder: (BuildContext context,
              {onStepContinue, onStepCancel}) {
            return Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: <Widget>[
                TextButton(
                    onPressed: onStepCancel,
                    child: const Text('ZURÜCK'),
                    style: TextButton.styleFrom(
                      primary: Theme.of(context).colorScheme.onPrimary,
                      backgroundColor: Theme.of(context).primaryColorLight,
                      padding: EdgeInsets.all(12),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.all(Radius.circular(4))),
                    )),
                SizedBox(
                  width: 12,
                ),
                TextButton(
                    onPressed: onStepContinue,
                    child:
                        Text(_currentStep < _lastStep ? 'WEITER' : 'ABSENDEN'),
                    style: TextButton.styleFrom(
                      primary: Theme.of(context).colorScheme.onPrimary,
                      backgroundColor: Theme.of(context).primaryColor,
                      padding: EdgeInsets.all(12),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.all(Radius.circular(4))),
                    )),
              ],
            );
          },
          steps: [
            Step(
              title: Text('Kartentyp'),
              content: CardTypeStep(),
              isActive: _currentStep >= 0,
              state:
                  _currentStep >= 1 ? StepState.complete : StepState.disabled,
            ),
            Step(
              title: Text('Voraussetzungen'),
              content: EntitlementStep(),
              isActive: _currentStep >= 0,
              state:
                  _currentStep >= 2 ? StepState.complete : StepState.disabled,
            ),
            Step(
              title: Text('Persönliche Daten'),
              content: PersonalDataStep(),
              isActive: _currentStep >= 0,
              state:
                  _currentStep >= 3 ? StepState.complete : StepState.disabled,
            ),
            Step(
              title: Text('Organisation'),
              content: OrganizationStep(),
              isActive: _currentStep >= 0,
              state:
                  _currentStep >= 4 ? StepState.complete : StepState.disabled,
            ),
            Step(
              title: Text('Zusammenfassung'),
              content: SummaryStep(),
              isActive: _currentStep >= 0,
              state:
                  _currentStep >= 5 ? StepState.complete : StepState.disabled,
            ),
          ]),
    );
  }

  _onStepTapped(step) {
    setState(() => _currentStep = step);
  }

  _onStepContinued() {
    if (_currentStep < _lastStep) {
      setState(() => _currentStep += 1);
    } else {
      Navigator.of(context).pop();
    }
  }

  _onStepCancel() {
    _currentStep > 0 ? setState(() => _currentStep -= 1) : null;
  }
}
