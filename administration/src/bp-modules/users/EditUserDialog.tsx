import { Callout, Checkbox, FormGroup, InputGroup } from '@blueprintjs/core'
import { Edit } from '@mui/icons-material'
import { Stack } from '@mui/material'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import styled from 'styled-components'

import { WhoAmIContext } from '../../WhoAmIProvider'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { Administrator, Role, useEditAdministratorMutation } from '../../generated/graphql'
import ConfirmDialog from '../../mui-modules/application/ConfirmDialog'
import { useAppToaster } from '../AppToaster'
import RegionSelector from './RegionSelector'
import RoleHelpButton from './RoleHelpButton'
import RoleSelector from './RoleSelector'

const RoleFormGroupLabel = styled.span`
  & span {
    display: inline-block !important;
  }
`

const EditUserDialog = ({
  selectedUser,
  onClose,
  onSuccess,
  regionIdOverride,
}: {
  onClose: () => void
  selectedUser: Administrator | null
  onSuccess: () => void
  // If regionIdOverride is set, the region selector will be hidden, and only RegionAdministrator and RegionManager
  // roles are selectable.
  regionIdOverride: number | null
}): ReactElement => {
  const appToaster = useAppToaster()
  const { me, refetch: refetchMe } = useContext(WhoAmIContext)
  const { t } = useTranslation('users')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role | null>(null)
  const [regionId, setRegionId] = useState<number | null>(null)
  const rolesWithRegion = [Role.RegionManager, Role.RegionAdmin]

  useEffect(() => {
    if (selectedUser !== null) {
      setEmail(selectedUser.email)
      setRole(selectedUser.role)
      setRegionId(selectedUser.regionId === undefined ? null : selectedUser.regionId)
    }
  }, [selectedUser])

  const [editAdministrator, { loading }] = useEditAdministratorMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: () => {
      appToaster?.show({ intent: 'success', message: t('editUserSuccess') })
      onClose()
      if (me?.id === selectedUser?.id) {
        refetchMe()
      } else {
        onSuccess()
      }
    },
  })

  const getRegionId = () => {
    if (regionIdOverride !== null) {
      return regionIdOverride
    }
    return role !== null && rolesWithRegion.includes(role) ? regionId : null
  }

  const onEditUser = () => {
    if (selectedUser === null) {
      console.error('Form submitted in an unexpected state.')
      return
    }

    editAdministrator({
      variables: {
        adminId: selectedUser.id,
        newEmail: email,
        newRole: role as Role,
        newRegionId: getRegionId(),
      },
    })
  }

  return (
    <ConfirmDialog
      open={selectedUser !== null}
      onClose={onClose}
      title={t('editUser')}
      id='edit-user-dialog'
      onConfirm={onEditUser}
      loading={loading}
      confirmButtonText={t('editUser')}
      confirmButtonIcon={<Edit />}>
      <Stack>
        <FormGroup label={t('eMail')}>
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
              {t('role')} <RoleHelpButton />
            </RoleFormGroupLabel>
          }>
          <RoleSelector role={role} onChange={setRole} hideProjectAdmin={regionIdOverride !== null} />
        </FormGroup>
        {regionIdOverride !== null || role === null || !rolesWithRegion.includes(role) ? null : (
          <RegionSelector onSelect={region => setRegionId(region.id)} selectedId={regionId} />
        )}
        <Callout intent='primary'>
          {selectedUser?.id === me?.id ? (
            <>
              {t('youCanChangeYourOwnPassword')}{' '}
              <Link to='/user-settings`' target='_blank' rel='noreferrer'>
                {t('userSettings')}
              </Link>{' '}
              {t('change')}.
            </>
          ) : (
            <>
              {t('userCanChangePassword')}{' '}
              <Link to='/forgot-password' target='_blank' rel='noreferrer'>
                {`${window.location.origin}/forgot-password`}
              </Link>{' '}
              {t('reset')}.
            </>
          )}
        </Callout>
        {selectedUser?.id !== me?.id ? null : (
          <Callout intent='danger' style={{ marginTop: '16px' }}>
            <b>{t('youEditYourOwnAccount')} </b>
            {t('youMayCannotUndoThis')}
            <Checkbox required>{t('ownAccountWarningConfirmation')}</Checkbox>
          </Callout>
        )}
      </Stack>
    </ConfirmDialog>
  )
}

export default EditUserDialog
