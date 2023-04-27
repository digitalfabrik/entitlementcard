import { Button, FormGroup, MenuItem } from '@blueprintjs/core'
import { ItemRenderer, Select } from '@blueprintjs/select'

import { Extension } from '.'
import { BavariaCardType } from '../../generated/card_pb'

type BavariaCardTypeState = 'Standard' | 'Goldkarte'

const bavaria_card_type: Extension<BavariaCardTypeState, null> = {
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

export default bavaria_card_type
