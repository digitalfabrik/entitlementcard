import { styled } from '@mui/system'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'

type StatisticsLegendProps = {
  items: string[]
}

const ColorIndicator = styled('div')(props => ({
  backgroundColor: props.color,
  width: 30,
  height: 30,
}))

const ItemContainer = styled('div')`
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
  gap: 12px;
  align-items: center;
`
const Container = styled('div')`
  padding: 16px;
  position: fixed;
  right: 3%;
  bottom: 10%;
`

const StatisticsLegend = ({ items }: StatisticsLegendProps): ReactElement | null => {
  const { cardStatistics } = useContext(ProjectConfigContext)
  const { t } = useTranslation('statistics')
  if (!cardStatistics.enabled) {
    return null
  }
  const indicatorColors = Object.values(cardStatistics.theme)
  return (
    <Container>
      {items.map((item, index) => (
        <ItemContainer key={item}>
          <ColorIndicator color={indicatorColors[index]} />
          {t(item)}
        </ItemContainer>
      ))}
    </Container>
  )
}

export default StatisticsLegend
