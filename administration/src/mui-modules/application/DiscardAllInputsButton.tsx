import { Delete } from '@mui/icons-material'
import { Button } from '@mui/material'
import React, { ReactElement, useState } from 'react'

import ConfirmDialog from './ConfirmDialog'

const DiscardAllInputsButton = ({ discardAll }: { discardAll: () => void }): ReactElement => {
  const [dialogOpen, setDialogOpen] = useState(false)
  return (
    <>
      <Button variant='outlined' endIcon={<Delete />} onClick={() => setDialogOpen(true)}>
        Alle Eingaben verwerfen
      </Button>
      <ConfirmDialog
        open={dialogOpen}
        onUpdateOpen={setDialogOpen}
        title='Alle Eingaben verwerfen?'
        content='Wollen Sie wirklich alle Eingaben unwiderruflich löschen?'
        onConfirm={discardAll}
      />
    </>
  )
}

export default DiscardAllInputsButton
