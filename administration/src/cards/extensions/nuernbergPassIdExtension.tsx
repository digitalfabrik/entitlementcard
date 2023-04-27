import { FormGroup, InputGroup, Intent } from '@blueprintjs/core'

import { Extension } from '.'

const nuernbergPassIdNumberLength = 10

type NuernbergPassIdState = { nuernbergPassId: number }
const nuernberg_pass_id_extension: Extension<NuernbergPassIdState, null> = {
  getInitialState: () => null,
  setProtobufData: (state, message) => {
    message.extensionNuernbergPassId = {
      passId: BigInt(state.nuernbergPassId),
    }
  },
  causesInfiniteLifetime: () => false,
  createForm: function (state, setState) {
    return (
      <FormGroup
        label='Pass-Id'
        labelFor='nuernberg-pass-input'
        intent={this.isValid(state) ? undefined : Intent.DANGER}>
        <InputGroup
          id='nuernberg-pass-input'
          placeholder='12345678'
          intent={this.isValid(state) ? undefined : Intent.DANGER}
          value={state?.nuernbergPassId.toString() ?? ''}
          maxLength={nuernbergPassIdNumberLength}
          onChange={event => {
            const value = event.target.value
            if (value.length > nuernbergPassIdNumberLength) {
              return
            }

            const parsedNumber = Number.parseInt(value)

            if (isNaN(parsedNumber)) {
              setState(null)
              return
            }

            setState({
              nuernbergPassId: parsedNumber,
            })
          }}
        />
      </FormGroup>
    )
  },
  isValid: state =>
    state !== null && state.nuernbergPassId > 0 && state.nuernbergPassId < 10 ** nuernbergPassIdNumberLength,
}

export default nuernberg_pass_id_extension
