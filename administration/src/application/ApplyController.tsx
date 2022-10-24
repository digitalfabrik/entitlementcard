import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import localforage from 'localforage'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ApplicationType,
  BlueCardEntitlementInput,
  BlueCardEntitlementType,
  useAddBlueEakApplicationMutation,
} from '../generated/graphql'
import {
  convertStandardEntitlementFormStateToInput,
  initialStandardEntitlementFormState,
  StandardEntitlementForm,
  StandardEntitlementFormState,
} from './StandardEntitlementForm'
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import {
  convertPersonalDataFormStateToInput,
  initialPersonalDataFormState,
  PersonalDataForm,
  PersonalDataFormState,
} from './PersonalDataForm'
import { useInitializeGlobalArrayBuffersManager } from './FileInputForm'

const EntitlementTypeInput = (props: {
  value: BlueCardEntitlementType | null
  setValue: (value: BlueCardEntitlementType) => void
}) => {
  return (
    <FormControl>
      <FormLabel>In den folgenden Fällen können Sie eine blaue Ehrenamtskarte beantragen:</FormLabel>
      <RadioGroup value={props.value} onChange={e => props.setValue(e.target.value as BlueCardEntitlementType)}>
        <FormControlLabel
          value={BlueCardEntitlementType.Standard}
          label='Ehrenamtliches Engagement seit mindestens 2 Jahren bei einem Verein oder einer Organisation'
          control={<Radio />}
        />
      </RadioGroup>
    </FormControl>
  )
}

const JuleicaEntitlementForm = () => null
const ServiceEntitlementForm = () => null

type ApplicationFormState = {
  entitlementType: BlueCardEntitlementType | null
  standardEntitlement: StandardEntitlementFormState
  personalData: PersonalDataFormState
}

const initialApplicationFormState: ApplicationFormState = {
  entitlementType: null,
  standardEntitlement: initialStandardEntitlementFormState,
  personalData: initialPersonalDataFormState,
}

function useLocallyStoredState<T>(initialState: T, storageKey: string): [T | null, (state: T) => void] {
  const [state, setState] = useState(initialState)
  const stateRef = useRef(state)
  const [loading, setLoading] = useState(true)

  const setStateAndRef = useCallback((state: T) => {
    setState(state)
    stateRef.current = state
  }, [])

  useEffect(() => {
    localforage
      .getItem<string>(storageKey)
      .then(storedString => {
        if (storedString !== null) {
          setStateAndRef(JSON.parse(storedString))
        }
      })
      .finally(() => setLoading(false))
  }, [storageKey])

  useEffect(() => {
    if (loading) {
      return
    }
    // Auto-save every 2 seconds
    let lastState: T | null = null
    const interval = setInterval(() => {
      if (lastState !== stateRef.current) {
        localforage.setItem(storageKey, JSON.stringify(stateRef.current))
        lastState = stateRef.current
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [loading])
  return [loading ? null : state, setStateAndRef]
}

const applicationStorageKey = 'applicationState'

const ApplyController = () => {
  const [addBlueEakApplication, result] = useAddBlueEakApplicationMutation()
  const [state, setState] = useLocallyStoredState(initialApplicationFormState, applicationStorageKey)
  const initialized = useInitializeGlobalArrayBuffersManager()

  if (state == null || !initialized) {
    return null
  }

  const getEntitlement = (): BlueCardEntitlementInput => {
    if (state.entitlementType === null) throw Error('EntitlementType is null.')
    switch (state.entitlementType) {
      case BlueCardEntitlementType.Standard:
        const workAtOrganizations = convertStandardEntitlementFormStateToInput(state.standardEntitlement)
        return {
          entitlementType: state.entitlementType,
          workAtOrganizations,
        }
      default:
        throw Error('Not yet implemented.')
    }
  }

  const submit = () => {
    const entitlement = getEntitlement()
    addBlueEakApplication({
      variables: {
        regionId: 1,
        application: {
          entitlement,
          personalData: convertPersonalDataFormStateToInput(state.personalData),
          hasAcceptedPrivacyPolicy: true,
          applicationType: ApplicationType.FirstApplication,
          givenInformationIsCorrectAndComplete: true,
        },
      },
    })
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'start', margin: '16px' }}>
      <div style={{ maxWidth: '1000px', width: '100%' }}>
        <h2 style={{ textAlign: 'center' }}>Blaue Ehrenamtskarte beantragen</h2>
        <form
          onSubmit={e => {
            e.preventDefault()
            submit()
          }}>
          <EntitlementTypeInput
            value={state.entitlementType}
            setValue={entitlementType => setState({ ...state, entitlementType })}
          />
          <div style={{ display: state.entitlementType === BlueCardEntitlementType.Standard ? 'block' : 'none' }}>
            <StandardEntitlementForm
              state={state.standardEntitlement}
              setState={standardEntitlement => setState({ ...state, standardEntitlement })}
            />
          </div>
          <div style={{ display: state.entitlementType === BlueCardEntitlementType.Juleica ? 'block' : 'none' }}>
            <JuleicaEntitlementForm />
          </div>
          <div style={{ display: state.entitlementType === BlueCardEntitlementType.Service ? 'block' : 'none' }}>
            <ServiceEntitlementForm />
          </div>

          <PersonalDataForm
            state={state.personalData}
            setState={personalData => setState({ ...state, personalData })}
          />

          <Button onClick={() => setState(initialApplicationFormState)}>Alle Eingaben verwerfen</Button>
          <Button variant='contained' type='submit'>
            Antrag Senden
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ApplyController
