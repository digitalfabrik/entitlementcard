/* eslint-disable react/destructuring-assignment */
import { Tooltip } from '@mui/material'
import React, { ReactElement } from 'react'

import { GetApplicationsType } from '../types'

const EXCERPT_LENGTH = 80

export const ApplicationNoteTooltip = (p: {
  application: GetApplicationsType
  children: ReactElement
}): ReactElement => (
  <Tooltip
    title={
      p.application.note && p.application.note.length > EXCERPT_LENGTH
        ? `${p.application.note.slice(0, EXCERPT_LENGTH)} ...`
        : p.application.note
    }>
    {p.children}
  </Tooltip>
)
