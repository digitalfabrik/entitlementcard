import {Icon, IconSize} from '@blueprintjs/core'
import {Breakpoint, Dialog, DialogContent, DialogContentText, DialogTitle} from '@mui/material'
import styled from 'styled-components'

const CloseIcon = styled(Icon)`
  align-self: center;
  cursor: pointer;
`

const StyledDialogTitle = styled(DialogTitle)`
  display: flex;
  justify-content: space-between;
`

const StyledDialogText = styled(DialogContentText)`
  white-space: pre-line`

const BasicDialog = ({
                         open,
                         onUpdateOpen,
                         title,
                         content,
                         maxWidth
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
                <CloseIcon
                    icon="cross"
                    onClick={() => onUpdateOpen(false)}
                    size={IconSize.LARGE}
                />
            </StyledDialogTitle>
            <DialogContent>
                <StyledDialogText>{content}</StyledDialogText>
            </DialogContent>
        </Dialog>
    )
}

export default BasicDialog
