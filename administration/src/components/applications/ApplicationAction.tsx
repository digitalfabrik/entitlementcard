import { Alert, Button } from '@blueprintjs/core'
import React, { ReactElement, useState } from 'react'

type ApplicationActionProps = {
  confirmAction: () => void
  loading: boolean
  cancelButtonText: string
  confirmButtonText: string
  buttonLabel: string
  dialogText: string
}

const ApplicationAction = ({
  confirmAction,
  loading,
  buttonLabel,
  confirmButtonText,
  cancelButtonText,
  dialogText,
}: ApplicationActionProps): ReactElement => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  const onConfirm = () => {
    confirmAction()
    setDialogOpen(false)
  }
  return (
    <>
      <Button onClick={() => setDialogOpen(true)} intent='danger' icon='trash'>
        {buttonLabel}
      </Button>
      <Alert
        cancelButtonText={cancelButtonText}
        confirmButtonText={confirmButtonText}
        icon='trash'
        intent='danger'
        isOpen={dialogOpen}
        loading={loading}
        onCancel={() => setDialogOpen(false)}
        onConfirm={onConfirm}>
        <p>{dialogText}</p>
      </Alert>
    </>
  )
}

export default ApplicationAction
