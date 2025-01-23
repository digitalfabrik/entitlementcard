import React, { ReactElement } from 'react'

const EmailLink = ({ email }: { email: string }): ReactElement => <a href={`mailto:${email}`}>{email}</a>

export default EmailLink
