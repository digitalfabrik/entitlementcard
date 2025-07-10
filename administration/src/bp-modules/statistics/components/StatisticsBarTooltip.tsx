import { BarTooltipProps } from '@nivo/bar'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { CardStatisticsResultModel } from '../../../generated/graphql'

const ToolTipContainer = styled.div`
  background: white;
  padding: 8px;
  border: 1px solid #b1b1b1;
  border-radius: 4px;
  display: flex;
  gap: 16px;
  align-items: center;
  box-shadow: 0 1px 3px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 15%);
  width: 200px;
`

const ColorContainer = styled.span<{ color: string }>`
  background-color: ${props => props.color};
  height: 32px;
  width: 32px;
`

const ValueContainer = styled.span`
  font-weight: bold;
`

const StatisticsBarTooltip = ({ data, id, color, value }: BarTooltipProps<CardStatisticsResultModel>): ReactElement => {
  const { t } = useTranslation('statistics')
  return (
    <ToolTipContainer>
      <ColorContainer color={color} /> {t(id.toString())} - {data.region}: <ValueContainer>{value}</ValueContainer>
    </ToolTipContainer>
  )
}

export default StatisticsBarTooltip
