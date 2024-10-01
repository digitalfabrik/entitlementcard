import { CardBlueprint } from './CardBlueprint'

class SelfServiceCard extends CardBlueprint {
  // Override isValid() to remove expiration check
  isValid(): boolean {
    return this.isFullNameValid() && this.extensions.every(ext => ext.isValid())
  }
}

export default SelfServiceCard
