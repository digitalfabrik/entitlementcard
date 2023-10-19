import { Button, FormGroup, MenuItem } from '@blueprintjs/core'
import { ItemRenderer, Select } from '@blueprintjs/select'
import { PartialMessage } from '@bufbuild/protobuf'

import { BavariaCardType as BavariaCardTypeEnum, CardExtensions } from '../../generated/card_pb'
import { Extension } from './extensions'

const BAVARIA_CARD_TYPE_STANDARD = 'Standard'
const BAVARIA_CARD_TYPE_STANDARD_LEGACY = 'blau'
const BAVARIA_CARD_TYPE_GOLD = 'Goldkarte'
const BAVARIA_CARD_TYPE_GOLD_LEGACY = 'gold'
type BavariaCardTypeState = typeof BAVARIA_CARD_TYPE_STANDARD | typeof BAVARIA_CARD_TYPE_GOLD

class BavariaCardTypeExtension extends Extension<BavariaCardTypeState, null> {
  public readonly name = BavariaCardTypeExtension.name

  setInitialState() {
    this.state = BAVARIA_CARD_TYPE_STANDARD
  }

  setProtobufData(message: PartialMessage<CardExtensions>) {
    message.extensionBavariaCardType = {
      cardType: this.state === BAVARIA_CARD_TYPE_GOLD ? BavariaCardTypeEnum.GOLD : BavariaCardTypeEnum.STANDARD,
    }
  }

  causesInfiniteLifetime(): boolean {
    return this.state === BAVARIA_CARD_TYPE_GOLD
  }

  createForm(onUpdate: () => void) {
    const CardTypeSelect = Select.ofType<BavariaCardTypeState>()

    const renderCardType: ItemRenderer<BavariaCardTypeState> = (cardType, { handleClick, modifiers }) => {
      if (!modifiers.matchesPredicate) {
        return null
      }
      return (
        <MenuItem
          active={modifiers.active}
          disabled={modifiers.disabled}
          text={cardType}
          key={cardType}
          onClick={handleClick}
        />
      )
    }

    return (
      <FormGroup label='Kartentyp'>
        <CardTypeSelect
          items={[BAVARIA_CARD_TYPE_STANDARD, BAVARIA_CARD_TYPE_GOLD]}
          activeItem={this.state}
          onItemSelect={value => {
            this.state = value
            onUpdate()
          }}
          itemRenderer={renderCardType}
          filterable={false}>
          <Button text={this.state} rightIcon='caret-down' />
        </CardTypeSelect>
      </FormGroup>
    )
  }

  isValid() {
    return this.state !== null
  }

  fromString(state: string) {
    if (state === BAVARIA_CARD_TYPE_STANDARD || state === BAVARIA_CARD_TYPE_STANDARD_LEGACY) {
      this.state = BAVARIA_CARD_TYPE_STANDARD
    } else if (state === BAVARIA_CARD_TYPE_GOLD || state === BAVARIA_CARD_TYPE_GOLD_LEGACY) {
      this.state = BAVARIA_CARD_TYPE_GOLD
    } else {
      this.state = null
    }
  }
  toString() {
    return this.state ?? ''
  }
}

export default BavariaCardTypeExtension
