import { FormGroup, InputGroup, Intent } from '@blueprintjs/core'

import { Extension } from './extensions'

const nuernbergPassIdNumberLength = 10

type NuernbergPassIdState = { nuernbergPassId: number }
class NuernbergPassIdExtension extends Extension<NuernbergPassIdState, null> {
  public readonly name = NuernbergPassIdExtension.name

  setInitialState() {}
  createForm(onUpdate: () => void) {
    return (
      <FormGroup
        label='Nürnberg-Pass-ID'
        labelFor='nuernberg-pass-id-input'
        intent={this.isValid() ? undefined : Intent.DANGER}>
        <InputGroup
          id='nuernberg-pass-id-input'
          placeholder='12345678'
          intent={this.isValid() ? undefined : Intent.DANGER}
          value={this.state?.nuernbergPassId.toString() ?? ''}
          maxLength={nuernbergPassIdNumberLength}
          onChange={event => {
            const value = event.target.value
            if (value.length > nuernbergPassIdNumberLength) {
              return
            }

            const parsedNumber = Number.parseInt(value)

            if (isNaN(parsedNumber)) {
              this.state = null
              onUpdate()
              return
            }

            this.state = {
              nuernbergPassId: parsedNumber,
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

  isValid() {
    return (
      this.state !== null &&
      this.state.nuernbergPassId > 0 &&
      this.state.nuernbergPassId < 10 ** nuernbergPassIdNumberLength
    )
  }

  fromString(state: string) {
    this.state = { nuernbergPassId: parseInt(state, 10) }
  }

  toString() {
    return this.state ? `${this.state.nuernbergPassId}` : ''
  }
}

export default NuernbergPassIdExtension
