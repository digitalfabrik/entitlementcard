import { Extension } from './extensions'

class EMailExtension extends Extension<string, null> {
  public readonly name = EMailExtension.name

  setInitialState() {}
  createForm() {
    return null
  }
  causesInfiniteLifetime() {
    return false
  }
  fromString(state: string): void {
    this.state = state
  }
  toString(): string {
    return this.state ?? ''
  }
  isValid() {
    return true
  }
}

export default EMailExtension
