import { Extension } from './extensions'

class EMailNotificationExtension extends Extension<string, null> {
  public readonly name = EMailNotificationExtension.name

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

export default EMailNotificationExtension
