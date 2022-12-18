import { Button, Classes, Dialog, FormGroup, HTMLSelect, InputGroup } from '@blueprintjs/core'
import { useContext, useState } from 'react'
import styled from 'styled-components'
import { Role, useCreateAdministratorMutation } from '../../generated/graphql'
import { useAppToaster } from '../AppToaster'
import RoleHelpButton from './RoleHelpButton'
import { roleToText } from './UsersTable'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import RegionSelector from '../RegionSelector'

const RoleFormGroupLabel = styled.span`
  & span {
    display: inline-block !important;
  }
`

const RoleSelector = ({ role, onChange }: { role: Role | null; onChange: (role: Role | null) => void }) => {
  return (
    <HTMLSelect fill onChange={e => onChange((e.target.value as Role | null) ?? null)} value={role ?? ''} required>
      <option value='' disabled>
        Auswählen...
      </option>
      <option value={Role.ProjectAdmin}>{roleToText(Role.ProjectAdmin)}</option>
      <option value={Role.RegionAdmin}>{roleToText(Role.RegionAdmin)}</option>
      <option value={Role.RegionManager}>{roleToText(Role.RegionManager)}</option>
    </HTMLSelect>
  )
}

const CreateUserDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) => {
  const appToaster = useAppToaster()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role | null>(null)
  const [regionId, setRegionId] = useState<number | null>(null)
  const project = useContext(ProjectConfigContext).projectId
  const rolesWithRegion = [Role.RegionManager, Role.RegionAdmin]

  const [createAdministrator, { loading }] = useCreateAdministratorMutation({
    onError: error => {
      console.error(error)
      appToaster?.show({ intent: 'danger', message: 'Es ist etwas schief gelaufen.' })
    },
    onCompleted: () => {
      appToaster?.show({ intent: 'success', message: 'Verwalter erfolgreich erstellt.' })
      onClose()
      onSuccess()
      // Reset State
      setEmail('')
      setRole(null)
      setRegionId(null)
    },
  })

  return (
    <Dialog title='Verwalter hinzufügen' isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={e => {
          e.preventDefault()
          createAdministrator({
            variables: {
              project,
              email,
              role: role as Role,
              regionId: role !== null && rolesWithRegion.includes(role) ? regionId : null,
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
            <RoleSelector role={role} onChange={setRole} />
          </FormGroup>
          {role === null || !rolesWithRegion.includes(role) ? null : (
            <div className={Classes.FORM_GROUP}>
              <div className={Classes.LABEL}>Region</div>
              <div className={Classes.FORM_CONTENT}>
                <RegionSelector onSelect={region => setRegionId(region.id)} selectedId={regionId} />
              </div>
            </div>
          )}
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button type='submit' intent='primary' text='Verwalter hinzufügen' loading={loading} />
          </div>
        </div>
      </form>
    </Dialog>
  )
}

export default CreateUserDialog
