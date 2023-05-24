import { FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import { PartialMessage } from '@bufbuild/protobuf'

import { CardExtensions } from '../../generated/card_pb'
import { Extension } from './extensions'

type NuernbergPassNumberState = { passNumber: number }

const nuernbergPassNumberLength = 8
class NuernbergPassNumberExtension extends Extension<NuernbergPassNumberState, null> {
  public readonly name = NuernbergPassNumberExtension.name

  setInitialState() {}
  createForm(onUpdate: () => void) {
    return (
      <FormGroup
        label='Nürnberg-Pass-Nummer'
        labelFor='nuernberg-pass-number-input'
        intent={this.isValid() ? undefined : Intent.DANGER}>
        <InputGroup
          id='nuernberg-pass-number-input'
          placeholder='12345678'
          intent={this.isValid() ? undefined : Intent.DANGER}
          value={this.state?.passNumber.toString() ?? ''}
          maxLength={nuernbergPassNumberLength}
          onChange={event => {
            const value = event.target.value
            if (value.length > nuernbergPassNumberLength) {
              return
            }

            const parsedNumber = Number.parseInt(value)

            if (isNaN(parsedNumber)) {
              this.state = null
              onUpdate()
              return
            }

            this.state = {
              passNumber: parsedNumber,
            }
            onUpdate()
          }}
        />
      </FormGroup>
    )
  }

  causesInfiniteLifetime() {
    return false
  }
  setProtobufData(message: PartialMessage<CardExtensions>) {
    message.extensionNuernbergPassNumber = {
      passNumber: this.state?.passNumber,
    }
  }

  isValid() {
    return this.state?.passNumber.toString().length === nuernbergPassNumberLength
  }

  fromString(state: string) {
    this.state = { passNumber: parseInt(state, 10) }
  }

  toString() {
    return this.state ? `${this.state.passNumber}` : ''
  }
}

export default NuernbergPassNumberExtension
