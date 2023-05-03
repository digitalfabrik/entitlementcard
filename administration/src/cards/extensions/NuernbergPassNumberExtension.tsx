import { FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import { PartialMessage } from '@bufbuild/protobuf'

import { CardExtensions } from '../../generated/card_pb'
import { Extension } from './extensions'

type NuernbergPassNumberState = { passNumber: number }

const nuernbergPassNumberLength = 8
export class NuernbergPassNumberExtension extends Extension<NuernbergPassNumberState, null> {
  setInitialState() {}
  createForm(onUpdate: () => void) {
    return (
      <FormGroup label='Passnummer' labelFor='nuernberg-pass-input' intent={this.isValid() ? undefined : Intent.DANGER}>
        <InputGroup
          id='nuernberg-pass-input'
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
}
