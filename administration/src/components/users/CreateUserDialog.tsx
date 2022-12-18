import { Button, Checkbox, Classes, Dialog, FormGroup, HTMLSelect, InputGroup } from '@blueprintjs/core'
import { useContext, useState } from 'react'
import styled from 'styled-components'
import { Role, useCreateAdministratorMutation } from '../../generated/graphql'
import { useAppToaster } from '../AppToaster'
import RoleHelpButton from './RoleHelpButton'
import { roleToText } from './UsersTable'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import RegionSelector from '../RegionSelector'
import { ApolloError } from '@apollo/client'

const RoleFormGroupLabel = styled.span`
  & span {
    display: inline-block !important;
  }
`

const RoleSelector = ({
  role,
  onChange,
  hideProjectAdmin,
}: {
  role: Role | null
  onChange: (role: Role | null) => void
  hideProjectAdmin: boolean
}) => {
  return (
    <HTMLSelect fill onChange={e => onChange((e.target.value as Role | null) ?? null)} value={role ?? ''} required>
      <option value='' disabled>
        Auswählen...
      </option>
      {hideProjectAdmin ? null : <option value={Role.ProjectAdmin}>{roleToText(Role.ProjectAdmin)}</option>}
      <option value={Role.RegionAdmin}>{roleToText(Role.RegionAdmin)}</option>
      <option value={Role.RegionManager}>{roleToText(Role.RegionManager)}</option>
    </HTMLSelect>
  )
}

const getMessageFromApolloError = (error: ApolloError): string => {
  const defaultMessage = 'Etwas ist schief gelaufen.'
  if (error.graphQLErrors.length !== 1) {
    return defaultMessage
  }
  const graphQLError = error.graphQLErrors[0]
  if ('code' in graphQLError.extensions) {
    switch (graphQLError.extensions['code']) {
      case 'EMAIL_ALREADY_EXISTS':
        return 'Die Email-Adresse wird bereits verwendet.'
    }
  }
  return defaultMessage
}

const CreateUserDialog = ({
  isOpen,
  onClose,
  onSuccess,
  regionIdOverride,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  // If regionIdOverride is set, the region selector will be hidden, and only RegionAdministrator and RegionManager
  // roles are selectable.
  regionIdOverride: number | null
}) => {
  const appToaster = useAppToaster()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role | null>(null)
  const [regionId, setRegionId] = useState<number | null>(null)
  const [sendWelcomeMail, setSendWelcomeMail] = useState(true)
  const project = useContext(ProjectConfigContext).projectId
  const rolesWithRegion = [Role.RegionManager, Role.RegionAdmin]

  const [createAdministrator, { loading }] = useCreateAdministratorMutation({
    onError: error => {
      console.error(error)
      appToaster?.show({ intent: 'danger', message: 'Fehler: ' + getMessageFromApolloError(error) })
    },
    onCompleted: () => {
      appToaster?.show({ intent: 'success', message: 'Benutzer erfolgreich erstellt.' })
      onClose()
      onSuccess()
      // Reset State
      setEmail('')
      setRole(null)
      setRegionId(null)
      setSendWelcomeMail(true)
    },
  })

  const getRegionId = () => {
    if (regionIdOverride !== null) {
      return regionIdOverride
    } else {
      return role !== null && rolesWithRegion.includes(role) ? regionId : null
    }
  }

  return (
    <Dialog title='Benutzer hinzufügen' isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={e => {
          e.preventDefault()
          createAdministrator({
            variables: {
              project,
              email,
              role: role as Role,
              regionId: getRegionId(),
              sendWelcomeMail,
            },
          })
        }}>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup label='Email-Adresse'>
            <InputGroup
              value={email}
              required
              onChange={e => setEmail(e.target.value)}
              type='email'
              placeholder='erika.musterfrau@example.org'
            />
          </FormGroup>
          <FormGroup
            label={
              <RoleFormGroupLabel>
                Rolle <RoleHelpButton />
              </RoleFormGroupLabel>
            }>
            <RoleSelector role={role} onChange={setRole} hideProjectAdmin={regionIdOverride !== null} />
          </FormGroup>
          {regionIdOverride !== null || role === null || !rolesWithRegion.includes(role) ? null : (
            <FormGroup label='Region'>
              <RegionSelector onSelect={region => setRegionId(region.id)} selectedId={regionId} />
            </FormGroup>
          )}
          <FormGroup>
            <Checkbox checked={sendWelcomeMail} onChange={e => setSendWelcomeMail(e.currentTarget.checked)}>
              <b>Sende eine Willkommens-Email.</b>
              <br />
              Diese Email enthält einen Link, mit dem das Passwort des Accounts gesetzt werden kann. Der Link ist 24
              Stunden gültig.
            </Checkbox>
          </FormGroup>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button type='submit' intent='success' text='Benutzer hinzufügen' icon='add' loading={loading} />
          </div>
        </div>
      </form>
    </Dialog>
  )
}

export default CreateUserDialog
