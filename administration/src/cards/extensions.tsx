import { Button, FormGroup, InputGroup, Intent, MenuItem } from '@blueprintjs/core'
import { DateInput } from '@blueprintjs/datetime'
import { ItemRenderer, Select } from '@blueprintjs/select'
import { PartialMessage } from '@bufbuild/protobuf'
import { sub } from 'date-fns'
import { ReactElement, JSXElementConstructor } from 'react'
import { BavariaCardType, CardExtensions } from '../generated/card_pb'
import { dateToDaysSinceEpoch, daysSinceEpochToDate } from './validityPeriod'

export interface Extension<T> {
  initialState: T | null
  isValid: (state: T | null) => boolean
  createForm: (state: T | null, setState: (state: T | null) => void) => React.ReactElement | null
  causesInfiniteLifetime: (state: T) => boolean
  setProtobufData: (state: T, message: PartialMessage<CardExtensions>) => void
}

export interface ExtensionHolder<T> {
  state: T
  extension: Extension<T>
}

export interface RegionState {
  region_id: number
}

export const region_extension: Extension<RegionState> = {
  initialState: null,

  causesInfiniteLifetime(_state: RegionState): boolean {
    return false
  },
  createForm(_state: RegionState | null, _setState: (state: RegionState) => void): React.ReactElement | null {
    return null
  },
  setProtobufData(state: RegionState, message: PartialMessage<CardExtensions>): void {
    message.extensionRegion = {
      regionId: state.region_id,
    }
  },
  isValid: function (state: RegionState | null): boolean {
    return !!state
  },
}

export interface BirthdayState {
  birthday: number
}
const initialBirthdayDate = dateToDaysSinceEpoch(new Date('1980-01-01T00:00+00:00'))

export const birthday_extension: Extension<BirthdayState> = {
  initialState: {
    birthday: initialBirthdayDate,
  },
  createForm: function (
    state: BirthdayState | null,
    setState: (state: BirthdayState | null) => void
  ): ReactElement<any, string | JSXElementConstructor<any>> | null {
    return (
      <FormGroup label='Geburtsdatum'>
        <DateInput
          placeholder='Geburtsdatum'
          value={daysSinceEpochToDate(state?.birthday || initialBirthdayDate)}
          parseDate={value => new Date(value)}
          onChange={value => {
            if (!value) {
              return setState(null)
            }
            setState({
              birthday: dateToDaysSinceEpoch(value),
            })
          }}
          formatDate={date => date.toLocaleDateString()}
          minDate={sub(Date.now(), { years: 150 })}
          maxDate={new Date()}
          fill={true}
        />
      </FormGroup>
    )
  },
  causesInfiniteLifetime: function (_state: BirthdayState): boolean {
    return false
  },
  setProtobufData: function (state: BirthdayState, message: PartialMessage<CardExtensions>): void {
    message.extensionBirthday = {
      birthday: state.birthday,
    }
  },
  isValid(state: BirthdayState | null): boolean {
    return !!state
  },
}

export interface NuernbergPassNumberState {
  pass_number: number
}

export const nuernberg_pass_number_extension: Extension<NuernbergPassNumberState> = {
  initialState: null,
  createForm: function (
    state: NuernbergPassNumberState | null,
    setState: (state: NuernbergPassNumberState | null) => void
  ): ReactElement<any, string | JSXElementConstructor<any>> | null {
    return (
      <FormGroup
        label='Passnummer'
        labelFor='nuernberg-pass-input'
        intent={this.isValid(state) ? undefined : Intent.DANGER}>
        <InputGroup
          id='nuernberg-pass-input'
          placeholder='12345678'
          intent={this.isValid(state) ? undefined : Intent.DANGER}
          value={state?.pass_number.toString() ?? ''}
          onChange={event => {
            const value = event.target.value
            if (value.length > 8) {
              return
            }

            const parsedNumber = Number.parseInt(value)

            if (isNaN(parsedNumber)) {
              setState(null)
              return
            }

            setState({
              pass_number: parsedNumber,
            })
          }}
        />
      </FormGroup>
    )
  },
  causesInfiniteLifetime: function (_state: NuernbergPassNumberState): boolean {
    return false
  },
  setProtobufData: function (state: NuernbergPassNumberState, message: PartialMessage<CardExtensions>): void {
    message.nuernbergPassNumber = {
      passNumber: state.pass_number,
    }
  },
  isValid: function (state: NuernbergPassNumberState | null): boolean {
    return state?.pass_number.toString().length === 8
  },
}

export type BavariaCardTypeState = 'Standard' | 'Goldkarte'

export const bavaria_card_type: Extension<BavariaCardTypeState> = {
  initialState: 'Standard',

  setProtobufData(state: BavariaCardTypeState, message: PartialMessage<CardExtensions>): void {
    message.extensionBavariaCardType = {
      cardType: state === 'Goldkarte' ? BavariaCardType.GOLD : BavariaCardType.STANDARD,
    }
  },

  causesInfiniteLifetime(state: BavariaCardTypeState): boolean {
    return state === 'Goldkarte'
  },

  createForm(
    state: BavariaCardTypeState | null,
    setState: (state: BavariaCardTypeState) => void
  ): React.ReactElement | null {
    const CardTypeSelect = Select.ofType<BavariaCardTypeState>()

    const renderCardType: ItemRenderer<BavariaCardTypeState> = (cardType, { handleClick, modifiers }) => {
      if (!modifiers.matchesPredicate) {
        return null
      }
      return (
        <MenuItem
          active={modifiers.active}
          disabled={modifiers.disabled}
          label={cardType}
          key={cardType}
          onClick={handleClick}
        />
      )
    }

    return (
      <FormGroup label='Kartentyp'>
        <CardTypeSelect
          items={['Standard', 'Goldkarte']}
          activeItem={state}
          onItemSelect={value => {
            setState(value)
          }}
          itemRenderer={renderCardType}
          filterable={false}>
          <Button text={state} rightIcon='caret-down' />
        </CardTypeSelect>
      </FormGroup>
    )
  },
  isValid: function (state: BavariaCardTypeState | null): boolean {
    return !!state
  },
}
