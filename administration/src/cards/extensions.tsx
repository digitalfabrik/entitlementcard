import { Button, FormGroup, MenuItem } from '@blueprintjs/core'
import { ItemRenderer, Select } from '@blueprintjs/select'
import { PartialMessage } from '@bufbuild/protobuf'
import { BavariaCardType, CardExtensions } from '../generated/card_pb'

export interface ExtensionHolder<T> {
  state: T
  extension: Extension<T>
}

export interface RegionState {
  region_id: number
}

export const region_extension: Extension<RegionState> = {
  initialState: null,

  causesInfiniteLifetime(state: RegionState): boolean {
    return false
  },
  createForm(state: RegionState, setState: (state: RegionState) => void): React.ReactElement | null {
    return null
  },
  setProtobufData(state: RegionState, message: PartialMessage<CardExtensions>): void {
    message.extensionRegion = {
      regionId: state.region_id,
    }
  },
}

export interface BirthdayState {
  birthday: number
}

//export const birthday: Extension<BirthdayState> = {}

export interface NuernbergPassNumberState {
  pass_number: number
}

//export const nuernberg_pass_number: Extension<NuernbergPassNumberState> = {}

export enum BavariaCardTypeState {
  standard = 'Standard',
  gold = 'Goldkarte',
}

export const bavaria_card_type: Extension<BavariaCardTypeState> = {
  initialState: BavariaCardTypeState.standard,

  setProtobufData(state: BavariaCardTypeState, message: PartialMessage<CardExtensions>): void {
    message.extensionBavariaCardType = {
      cardType: state == BavariaCardTypeState.gold ? BavariaCardType.GOLD : BavariaCardType.STANDARD,
    }
  },

  causesInfiniteLifetime(state: BavariaCardTypeState): boolean {
    return state == BavariaCardTypeState.gold
  },

  createForm(state: BavariaCardTypeState, setState: (state: BavariaCardTypeState) => void): React.ReactElement | null {
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
      <FormGroup label='Typ der Karte'>
        <CardTypeSelect
          items={Object.values(BavariaCardTypeState)}
          onItemSelect={value => {
            state = value
            // TODO: if (state == BavariaCardTypeState.gold) {
            //  state.expirationDate = null
            //}
            setState(state)
          }}
          itemRenderer={renderCardType}
          filterable={false}>
          <Button text={state} rightIcon='caret-down' />
        </CardTypeSelect>
      </FormGroup>
    )
  },
}

export interface Extension<T> {
  initialState: T | null
  createForm: (state: T, setState: (state: T) => void) => React.ReactElement | null
  causesInfiniteLifetime: (state: T) => boolean
  setProtobufData: (state: T, message: PartialMessage<CardExtensions>) => void
}
