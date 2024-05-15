import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { ApplicationStatus } from './constants'

const ItemContainer = styled.button<{ $active: boolean }>`
  display: flex;
  flex: 1;
  justify-content: center;
  padding: 12px;
  text-transform: uppercase;
  border: none;
  background-color: transparent;
  font-weight: bold;
  cursor: pointer;
  :hover {
    background: #8f99a826;
  }
  ${props => props.$active && `background:#8f99a84d`};
`

type ApplicationStatusBarItemProps = {
  title: string
  setActiveButton: (title: string) => void
  filterApplications: (status?: ApplicationStatus) => void
  active: boolean
  count: number
  status?: ApplicationStatus
}

const ApplicationStatusBarItem = ({
  title,
  filterApplications,
  setActiveButton,
  active,
  status,
  count,
}: ApplicationStatusBarItemProps): ReactElement => {
  const onClickFilterButton = () => {
    setActiveButton(title)
    filterApplications(status)
  }

  return (
    <ItemContainer onClick={() => onClickFilterButton()} id={title} $active={active}>
      {`${title}(${count})`}
    </ItemContainer>
  )
}

export default ApplicationStatusBarItem
