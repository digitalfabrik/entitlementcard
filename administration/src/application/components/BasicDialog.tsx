import CloseIcon from '@mui/icons-material/Close'
import { Breakpoint, Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import styled from 'styled-components'

const StyledDialogTitle = styled(DialogTitle)`
  display: flex;
  justify-content: space-between;
`

const StyledCloseIcon = styled(CloseIcon)`
  cursor: pointer;
`

const StyledDialogText = styled(DialogContentText)`
  white-space: pre-line;
`

const BasicDialog = ({
  open,
  onUpdateOpen,
  title,
  content,
  maxWidth,
}: {
  open: boolean
  onUpdateOpen: (open: boolean) => void
  title: string
  content: string
  maxWidth?: Breakpoint | false
}) => {
  return (
    <Dialog open={open} onBackdropClick={() => onUpdateOpen(false)} maxWidth={maxWidth}>
      <StyledDialogTitle>
        {title}
        <StyledCloseIcon onClick={() => onUpdateOpen(false)} />
      </StyledDialogTitle>
      <DialogContent>
        <StyledDialogText>{content}</StyledDialogText>
      </DialogContent>
    </Dialog>
  )
}

export default BasicDialog
