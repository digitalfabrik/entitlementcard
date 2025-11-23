import { Link } from '@mui/material'
import { ReactElement } from 'react'

const EmailLink = ({ email }: { email: string }): ReactElement => <Link href={`mailto:${email}`}>{email}</Link>

export default EmailLink
