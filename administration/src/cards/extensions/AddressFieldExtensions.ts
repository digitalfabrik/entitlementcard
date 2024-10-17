/* eslint-disable max-classes-per-file */
import { Extension } from './extensions'

abstract class BaseAddressExtension extends Extension<string, null> {
  setInitialState() {
    this.state = ''
  }
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

class AddressLine1Extension extends BaseAddressExtension {
  public readonly name = AddressLine1Extension.name
}

class AddressLine2Extension extends BaseAddressExtension {
  public readonly name = AddressLine2Extension.name
}

class PlzExtension extends BaseAddressExtension {
  public readonly name = PlzExtension.name
  isValid() {
    return this.state?.length === 0 || (!!this.state && /^\d{5}$/.test(this.state))
  }
}

class LocationExtension extends BaseAddressExtension {
  public readonly name = LocationExtension.name
}

const AddressExtensions = [AddressLine1Extension, AddressLine2Extension, PlzExtension, LocationExtension] as const

export default AddressExtensions
