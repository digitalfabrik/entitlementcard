import { Extension } from './extensions'

class EMailNotificationExtension extends Extension<string, null> {
  public readonly name = EMailNotificationExtension.name

  setInitialState(): void {
    return undefined
  }
  createForm(): null {
    return null
  }
  causesInfiniteLifetime(): boolean {
    return false
  }
  fromString(state: string): void {
    this.state = state
  }
  toString(): string {
    return this.state ?? ''
  }
  isValid(): boolean {
    return true
  }
}

export default EMailNotificationExtension
