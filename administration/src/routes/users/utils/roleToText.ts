import i18next from 'i18next'

import { Role } from '../../../generated/graphql'

const roleToText = (role: Role): string => {
  switch (role) {
    case Role.NoRights:
      return i18next.t('users:noRights')
    case Role.ProjectAdmin:
      return i18next.t('users:projectAdmin')
    case Role.ProjectStoreManager:
      return i18next.t('users:projectStoreManager')
    case Role.RegionAdmin:
      return i18next.t('users:regionAdmin')
    case Role.RegionManager:
      return i18next.t('users:regionManager')
    case Role.ExternalVerifiedApiUser:
      return i18next.t('users:externalVerifiedApiUser')
    default:
      return role
  }
}
export default roleToText
