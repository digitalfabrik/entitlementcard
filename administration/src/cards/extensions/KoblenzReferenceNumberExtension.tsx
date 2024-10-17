import { FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import { PartialMessage } from '@bufbuild/protobuf'
import React, { ReactElement } from 'react'

import { CardExtensions } from '../../generated/card_pb'
import ClearInputButton from './components/ClearInputButton'
import { Extension } from './extensions'

type KoblenzReferenceNumberState = { referenceNumber: string }

const KoblenzReferenceNumberMinLength = 4
const KoblenzReferenceNumberMaxLength = 15

class KoblenzReferenceNumberExtension extends Extension<KoblenzReferenceNumberState, null> {
  public readonly name = KoblenzReferenceNumberExtension.name

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setInitialState(): void {}
  createForm(onUpdate: () => void, viewportSmall = true): ReactElement {
    const clearInput = () => {
      this.state = { referenceNumber: '' }
      onUpdate()
    }

    return (
      <FormGroup
        label='Referenznummer'
        labelFor='koblenz-reference-number-input'
        intent={this.isValid() ? undefined : Intent.DANGER}>
        <InputGroup
          fill
          large={viewportSmall}
          id='koblenz-reference-number-input'
          placeholder='5.012.067.281, 000D000001, 99478'
          intent={this.isValid() ? undefined : Intent.DANGER}
          value={this.state?.referenceNumber ?? ''}
          minLength={KoblenzReferenceNumberMinLength}
          maxLength={KoblenzReferenceNumberMaxLength}
          rightElement={
            <ClearInputButton viewportSmall={viewportSmall} onClick={clearInput} input={this.state?.referenceNumber} />
          }
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

  causesInfiniteLifetime(): boolean {
    return false
  }
  setProtobufData(message: PartialMessage<CardExtensions>): void {
    message.extensionKoblenzReferenceNumber = {
      referenceNumber: this.state?.referenceNumber,
    }
  }

  isValid(): boolean {
    return (
      this.state !== null &&
      this.state.referenceNumber.length >= KoblenzReferenceNumberMinLength &&
      this.state.referenceNumber.length <= KoblenzReferenceNumberMaxLength
    )
  }

  fromString(state: string): void {
    this.state = { referenceNumber: state }
  }

  toString(): string {
    return this.state?.referenceNumber ?? ''
  }
}

export default KoblenzReferenceNumberExtension
