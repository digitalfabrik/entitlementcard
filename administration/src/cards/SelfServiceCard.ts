import { CardBlueprint } from './CardBlueprint'

class SelfServiceCard extends CardBlueprint {
  // Override isValid() to remove expiration check in the frontend since the expiration date will be added from userentitlements table
  isValid(): boolean {
    return this.isFullNameValid() && this.extensions.every(ext => ext.isValid())
  }
}

export default SelfServiceCard
