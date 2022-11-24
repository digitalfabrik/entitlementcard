import {Icon, IconSize} from '@blueprintjs/core'
import {Dialog, DialogContent, DialogContentText, DialogTitle} from '@mui/material'

const BasicDialog = ({
                         open,
                         onUpdateOpen,
                         title,
                         content,
                     }: {
    open: boolean
    onUpdateOpen: (open: boolean) => void
    title: string
    content: string
}) => {
    return (
        <Dialog open={open} onBackdropClick={() => onUpdateOpen(false)}>
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
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
        </Dialog>
    )
}

export default BasicDialog
