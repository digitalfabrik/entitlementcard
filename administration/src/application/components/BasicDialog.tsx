import {Icon, IconSize} from '@blueprintjs/core'
import {Breakpoint, Dialog, DialogContent, DialogContentText, DialogTitle} from '@mui/material'

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
            <DialogTitle style={{display: 'flex', justifyContent: 'space-between'}}>
                {title}
                <Icon
                    icon="cross"
                    onClick={() => onUpdateOpen(false)}
                    style={{alignSelf: 'center'}}
                    size={IconSize.LARGE}
                />
            </DialogTitle>
            <DialogContent>
                <DialogContentText style={{whiteSpace: 'pre-line'}}>{content}</DialogContentText>
            </DialogContent>
        </Dialog>
    )
}

export default BasicDialog
