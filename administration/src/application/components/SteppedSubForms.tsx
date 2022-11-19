import { SetState, useUpdateStateCallback } from '../useUpdateStateCallback'
import { Form, ValidationResult } from '../FormType'
import { ReactNode, useCallback } from 'react'
import { Button, Divider, Step, ButtonBase, StepContent, StepLabel, Stepper } from '@mui/material'

const SteppedSubForms = ({
  activeStep,
  setActiveStep,
  subForms,
  onSubmit,
}: {
  activeStep: number
  setActiveStep: SetState<number>
  subForms: { label: string; element: ReactNode; validate: () => ValidationResult<unknown> }[]
  onSubmit: () => void
}) => {
  const tryGoTo = (index: number) => {
    for (let i = 0; i < index; i++) {
      if (subForms[i].validate().type === 'error') {
        return setActiveStep(() => i)
      }
    }
    setActiveStep(() => index)
  }
  return (
    <Stepper activeStep={activeStep} orientation='vertical'>
      {subForms.map(({ validate, label, element }, index) => {
        return (
          <Step key={index}>
            <ButtonBase onClick={() => tryGoTo(index)} style={{ marginLeft: '-8px' }}>
              <StepLabel style={{ cursor: 'pointer', padding: '8px' }}>{label}</StepLabel>
            </ButtonBase>
            <StepContent>
              <SubForm
                validate={validate}
                index={index}
                setActiveStep={setActiveStep}
                onSubmit={index === subForms.length - 1 ? onSubmit : undefined}>
                {element}
              </SubForm>
            </StepContent>
          </Step>
        )
      })}
    </Stepper>
  )
}

const SubForm = ({
  children,
  validate,
  index,
  setActiveStep,
  onSubmit,
}: {
  children: ReactNode
  validate: () => ValidationResult<unknown>
  index: number
  setActiveStep: SetState<number>
  onSubmit?: () => void
}) => {
  const handleOnSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (validate().type === 'error') {
        alert('Aahhhh') // TODO: Show all errors to the user
      } else if (onSubmit === undefined) {
        setActiveStep(() => index + 1)
      } else {
        onSubmit()
      }
    },
    [validate, onSubmit, setActiveStep, index]
  )
  return (
    <form onSubmit={handleOnSubmit}>
      {children}
      <Divider sx={{ margin: '16px' }} />
      {index === 0 ? null : <Button onClick={() => setActiveStep(() => index - 1)}>Zurück</Button>}
      {onSubmit === undefined ? (
        <Button type='submit' variant='contained'>
          Nächster Schritt
        </Button>
      ) : (
        <Button type='submit' variant='contained'>
          Antrag Abschicken
        </Button>
      )}
    </form>
  )
}

export const useFormAsStep = <
  Options extends {},
  ValidatedInput,
  AdditionalProps extends {},
  ParentState,
  KeyInParent extends keyof ParentState
>(
  label: string,
  form: Form<ParentState[KeyInParent], Options, ValidatedInput, AdditionalProps>,
  parentState: ParentState,
  setParentState: SetState<ParentState>,
  keyInParent: KeyInParent,
  options: Options,
  additionalProps: AdditionalProps
): { label: string; validate: () => ValidationResult<unknown>; element: ReactNode } => {
  const state = parentState[keyInParent]
  const setState = useUpdateStateCallback(setParentState, keyInParent)
  const validate = useCallback(() => form.getValidatedInput(state, options), [state, form, options])
  const formProps = { ...additionalProps, options, state, setState }
  const element = <form.Component {...formProps} />
  return { label, validate, element }
}

export default SteppedSubForms
