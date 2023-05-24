import { Extension } from './extensions'

abstract class BaseAdressExtension extends Extension<string, null> {
  setInitialState() {}
  causesInfiniteLifetime() {
    return false
  }
  createForm() {
    return null
  }
  isValid(): boolean {
    return this.state !== null
  }
  fromString(state: string): void {
    this.state = state
  }
  toString(): string {
    return this.state ?? ''
  }
}

class AdressLine1Extension extends BaseAdressExtension {
  public readonly name = AdressLine1Extension.name
}

class AdressLine2Extension extends BaseAdressExtension {
  public readonly name = AdressLine2Extension.name
}

class PlzExtension extends BaseAdressExtension {
  public readonly name = PlzExtension.name
  isValid() {
    return this.state?.length === 0 || (!!this.state && /^\d{5}$/.test(this.state))
  }
}

class LocationExtension extends BaseAdressExtension {
  public readonly name = LocationExtension.name
}

const AdressExtensions = [AdressLine1Extension, AdressLine2Extension, PlzExtension, LocationExtension]

export default AdressExtensions
