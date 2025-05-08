import { FormLabel, styled } from '@mui/material'
import React, { ReactElement } from 'react'

const CustomFormLabel = ({ label, htmlFor }: { label: string; htmlFor?: string }): ReactElement => {
  const StyledFormLabel = styled(FormLabel)`
    font-size: 14px;
    font-weight: 400;
    color: #1c2127;
    margin-bottom: 5px;
  `
  return <StyledFormLabel htmlFor={htmlFor}>{label}</StyledFormLabel>
}

export default CustomFormLabel
