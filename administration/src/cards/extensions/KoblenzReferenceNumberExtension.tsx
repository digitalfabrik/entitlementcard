import { FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import { PartialMessage } from '@bufbuild/protobuf'

import { CardExtensions } from '../../generated/card_pb'
import { Extension } from './extensions'

type KoblenzReferenceNumberState = { referenceNumber: string }

const KoblenzReferenceNumberMinLength = 4
const KoblenzReferenceNumberMaxLength = 15
class KoblenzReferenceNumberExtension extends Extension<KoblenzReferenceNumberState, null> {
  public readonly name = KoblenzReferenceNumberExtension.name

  setInitialState() {}
  createForm(onUpdate: () => void) {
    return (
      <FormGroup
        label='Referenznummer'
        labelFor='koblenz-reference-number-input'
        intent={this.isValid() ? undefined : Intent.DANGER}>
        <InputGroup
          id='koblenz-reference-number-input'
          placeholder='5.012.067.281, 000D000001, 99478'
          intent={this.isValid() ? undefined : Intent.DANGER}
          value={this.state?.referenceNumber ?? ''}
          minLength={KoblenzReferenceNumberMinLength}
          maxLength={KoblenzReferenceNumberMaxLength}
          onChange={event => {
            const value = event.target.value
            if (value.length > KoblenzReferenceNumberMaxLength) {
              return
            }

            this.state = {
              referenceNumber: value,
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
    message.extensionKoblenzReferenceNumber = {
      referenceNumber: this.state?.referenceNumber,
    }
  }

  isValid() {
    return (
      this.state !== null &&
      this.state.referenceNumber.length >= KoblenzReferenceNumberMinLength &&
      this.state.referenceNumber.length <= KoblenzReferenceNumberMaxLength
    )
  }

  fromString(state: string) {
    if (state === null) {
      this.state = null
    }
    this.state = { referenceNumber: state }
  }

  toString() {
    return this.state?.referenceNumber ?? ''
  }
}

export default KoblenzReferenceNumberExtension
