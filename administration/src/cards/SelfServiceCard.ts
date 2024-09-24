import { CardBlueprint } from './CardBlueprint'

class SelfServiceCard extends CardBlueprint {
  isValid(): boolean {
    return (
      // Name valid
      this.isFullNameValid() &&
      // Extensions valid
      this.extensions.every(ext => ext.isValid())
    )
  }
}

export default SelfServiceCard
