import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import AlertBox from '../components/AlertBox'
import { Role } from '../generated/graphql'
import { useWhoAmI } from '../provider/WhoAmIProvider'

/** With this component you can protect rendering child components.
 *
 * @param allowedRoles - The roles that are allowed to render the children. If not set, all roles are allowed.
 * @param condition - If set to false, the children will not be rendered.
 * @param children - The children that should be rendered.
 * @param error - Can be defined to display an error message if the user does not have the required role.
 * @returns The children if the user has the required role. Otherwise, an error message is displayed.
 */
type RenderGuardProps = {
  allowedRoles?: Role[]
  condition?: boolean
  children: ReactNode
  error?: { title?: string; description?: string }
}

const RenderGuard = ({ allowedRoles, children, condition, error }: RenderGuardProps): ReactElement | null => {
  const { t } = useTranslation('errors')
  const { role } = useWhoAmI().me

  const hasValidRole = allowedRoles === undefined || allowedRoles.includes(role)

  if (hasValidRole && condition !== false) {
    return <>{children}</>
  }

  if (error === undefined) {
    return null
  }

  const { title, description } = error

  return (
    <AlertBox
      severity='error'
      title={title || t('notAuthorized')}
      description={description || t('notAuthorizedDescription')}
    />
  )
}

export default RenderGuard
