import { Button, FormGroup, InputGroup, Intent, MenuItem } from '@blueprintjs/core'
import { DateInput } from '@blueprintjs/datetime'
import { ItemRenderer, Select } from '@blueprintjs/select'
import { PartialMessage } from '@bufbuild/protobuf'
import { sub } from 'date-fns'
import { BavariaCardType, CardExtensions } from '../generated/card_pb'
import { dateToDaysSinceEpoch, daysSinceEpochToDate } from './validityPeriod'
import { Region } from '../generated/graphql'

export type Extension<T, R> = {
  getInitialState: (args: R) => T | null
  isValid: (state: T | null) => boolean
  createForm: (state: T | null, setState: (state: T | null) => void) => React.ReactElement | null
  causesInfiniteLifetime: (state: T) => boolean
  setProtobufData: (state: T, message: PartialMessage<CardExtensions>) => void
}

export type ExtensionHolder<T, R> = {
  state: T | null
  extension: Extension<T, R>
}

export function createExtensionHolder<T, R>(extension: Extension<T, R>, initialStateArg: R): ExtensionHolder<T, R> {
  return {
    state: extension.getInitialState(initialStateArg),
    extension,
  }
}

type RegionState = { regionId: number }

export const region_extension: Extension<RegionState, Region> = {
  getInitialState: region => ({ regionId: region.id }),
  causesInfiniteLifetime: () => false,
  createForm: () => null,
  setProtobufData: (state, message) => {
    message.extensionRegion = {
      regionId: state.regionId,
    }
  },
  isValid: state => state !== null,
}

type BirthdayState = { birthday: number }

const initialBirthdayDate = dateToDaysSinceEpoch(new Date('1980-01-01T00:00+00:00'))

export const birthday_extension: Extension<BirthdayState, null> = {
  getInitialState: () => ({ birthday: initialBirthdayDate }),
  createForm: (state, setState) => (
    <FormGroup label='Geburtsdatum'>
      <DateInput
        placeholder='Geburtsdatum'
        value={daysSinceEpochToDate(state?.birthday ?? initialBirthdayDate)}
        parseDate={value => {
          const millis = Date.parse(value)
          return isNaN(millis) ? false : new Date(millis)
        }}
        onChange={value => setState(value !== null ? { birthday: dateToDaysSinceEpoch(value) } : null)}
        formatDate={date => date.toLocaleDateString()}
        minDate={sub(Date.now(), { years: 150 })}
        maxDate={new Date()}
        fill={true}
      />
    </FormGroup>
  ),
  causesInfiniteLifetime: () => false,
  setProtobufData: (state, message) => {
    message.extensionBirthday = {
      birthday: state.birthday,
    }
  },
  isValid: state => state !== null,
}

type NuernbergPassNumberState = { passNumber: number }

const nuernbergPassNumberLength = 8
export const nuernberg_pass_number_extension: Extension<NuernbergPassNumberState, null> = {
  getInitialState: () => null,
  createForm: function (state, setState) {
    return (
      <FormGroup
        label='Passnummer'
        labelFor='nuernberg-pass-input'
        intent={this.isValid(state) ? undefined : Intent.DANGER}>
        <InputGroup
          id='nuernberg-pass-input'
          placeholder='12345678'
          intent={this.isValid(state) ? undefined : Intent.DANGER}
          value={state?.passNumber.toString() ?? ''}
          maxLength={nuernbergPassNumberLength}
          onChange={event => {
            const value = event.target.value
            if (value.length > nuernbergPassNumberLength) {
              return
            }

            const parsedNumber = Number.parseInt(value)

            if (isNaN(parsedNumber)) {
              setState(null)
              return
            }

            setState({
              passNumber: parsedNumber,
            })
          }}
        />
      </FormGroup>
    )
  },
  causesInfiniteLifetime: () => false,
  setProtobufData: (state, message) => {
    message.extensionNuernbergPassNumber = {
      passNumber: state.passNumber,
    }
  },
  isValid: state => state?.passNumber.toString().length === nuernbergPassNumberLength,
}

type BavariaCardTypeState = 'Standard' | 'Goldkarte'

export const bavaria_card_type: Extension<BavariaCardTypeState, null> = {
  getInitialState: () => 'Standard',
  setProtobufData: (state, message) => {
    message.extensionBavariaCardType = {
      cardType: state === 'Goldkarte' ? BavariaCardType.GOLD : BavariaCardType.STANDARD,
    }
  },
  causesInfiniteLifetime: (state: BavariaCardTypeState) => state === 'Goldkarte',
  createForm: (state, setState) => {
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
  isValid: state => state !== null,
}
