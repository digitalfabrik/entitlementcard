import { FormGroup, InputGroup, Intent } from '@blueprintjs/core'

import { Extension } from '.'

type NuernbergPassNumberState = { passNumber: number }

const nuernbergPassNumberLength = 8
const nuernberg_pass_number_extension: Extension<NuernbergPassNumberState, null> = {
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

export default nuernberg_pass_number_extension
