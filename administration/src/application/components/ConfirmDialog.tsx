import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

const ConfirmDialog = ({
  open,
  setOpen,
  title,
  content,
  onConfirm,
  confirmButtonText = 'Bestätigen',
}: {
  open: boolean
  setOpen: (open: boolean) => void
  title: string
  content: string
  onConfirm: () => void
  confirmButtonText?: string
}) => {
  return (
    <Dialog open={open} onClick={() => setOpen(false)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Abbrechen</Button>
        <Button
          onClick={() => {
            setOpen(false)
            onConfirm()
          }}>
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
