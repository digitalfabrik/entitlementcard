import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { useState } from 'react'
import {
  BlueCardEntitlementInput,
  BlueCardEntitlementType,
  useAddBlueEakApplicationMutation,
} from '../generated/graphql'
import {
  initialStandardEntitlementFormState,
  StandardEntitlementForm,
  StandardEntitlementFormState,
} from './StandardEntitlementForm'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'

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

const ApplyController = () => {
  const [addBlueEakApplication, result] = useAddBlueEakApplicationMutation()
  const [entitlementType, setEntitlementType] = useState<BlueCardEntitlementType | null>(null)
  const [standardEntitlementFormState, setStandardEntitlementFormState] = useState<StandardEntitlementFormState>(
    initialStandardEntitlementFormState
  )

  const getEntitlement = (): BlueCardEntitlementInput => {
    if (entitlementType === null) throw Error('EntitlementType is null.')
    switch (entitlementType) {
      case BlueCardEntitlementType.Service:
      default:
        throw Error('Not yet implemented.')
    }
  }

  const submit = () => {
    if (entitlementType === BlueCardEntitlementType.Standard) {
    }
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
          <EntitlementTypeInput value={entitlementType} setValue={setEntitlementType} />
          <div style={{ display: entitlementType === BlueCardEntitlementType.Standard ? 'block' : 'none' }}>
            <StandardEntitlementForm state={standardEntitlementFormState} setState={setStandardEntitlementFormState} />
          </div>
          <div style={{ display: entitlementType === BlueCardEntitlementType.Juleica ? 'block' : 'none' }}>
            <JuleicaEntitlementForm />
          </div>
          <div style={{ display: entitlementType === BlueCardEntitlementType.Service ? 'block' : 'none' }}>
            <ServiceEntitlementForm />
          </div>
          <div>{/*<Button type='submit' intent='primary' icon='send-message' text='Antrag Senden' />*/}</div>
        </form>
      </div>
    </div>
  )
}

export default ApplyController
