import { Button, FormGroup, MenuItem } from '@blueprintjs/core'
import { ItemRenderer, Select } from '@blueprintjs/select'
import { PartialMessage } from '@bufbuild/protobuf'

import { BavariaCardType as BavariaCardTypeEnum, CardExtensions } from '../../generated/card_pb'
import { Extension } from './extensions'

type BavariaCardTypeState = 'Standard' | 'Goldkarte'

class BavariaCardTypeExtension extends Extension<BavariaCardTypeState, null> {
  public readonly name = BavariaCardTypeExtension.name

  setInitialState() {
    this.state = 'Standard'
  }

  setProtobufData(message: PartialMessage<CardExtensions>) {
    message.extensionBavariaCardType = {
      cardType: this.state === 'Goldkarte' ? BavariaCardTypeEnum.GOLD : BavariaCardTypeEnum.STANDARD,
    }
  }

  causesInfiniteLifetime(): boolean {
    return this.state === 'Goldkarte'
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
          items={['Standard', 'Goldkarte']}
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
    this.state = state === 'Goldkarte' || state === 'Standard' ? state : null
  }
  toString() {
    return this.state ?? ''
  }
}

export default BavariaCardTypeExtension
