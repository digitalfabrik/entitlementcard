import { BarTooltipProps } from '@nivo/bar'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { CardStatisticsResultModel } from '../../../generated/graphql'

const ToolTipContainer = styled.div`
  background: white;
  padding: 12px;
  border: 1px solid #b1b1b1;
  border-radius: 4px;
  display: flex;
  gap: 16px;
  align-items: center;
  box-shadow: 0 1px 3px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 15%);
  width: 250px;
  justify-content: space-between;
`

const ColorContainer = styled.div<{ color: string }>`
  background-color: ${props => props.color};
  height: 32px;
  max-width: 32px;
  flex: 1 1 32px;
`

const TextContainer = styled.div`
  flex: 0 1 60%;
`

const ValueContainer = styled.span`
  font-weight: bold;
`

const StatisticsBarTooltip = ({ id, color, value }: BarTooltipProps<CardStatisticsResultModel>): ReactElement => {
  const { t } = useTranslation('statistics')
  return (
    <ToolTipContainer>
      <ColorContainer color={color} /> <TextContainer>{t(id.toString())}:</TextContainer>{' '}
      <ValueContainer>{value}</ValueContainer>
    </ToolTipContainer>
  )
}

export default StatisticsBarTooltip
