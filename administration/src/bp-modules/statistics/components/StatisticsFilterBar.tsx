import { Button, FormGroup, Tooltip } from '@blueprintjs/core'
import formatDate from 'date-fns/format'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import StickyBottomBar from '../../StickyBottomBar'
import CustomDatePicker from '../../components/CustomDatePicker'
import { defaultEndDate, defaultStartDate } from '../constants'

const StyledFormGroup = styled(FormGroup)`
  margin: 0 16px 0 0;
  align-self: center;
  align-items: center;
`

const filterDateFormat = 'yyyy-MM-dd'

const InputContainer = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: flex-start;
  flex: 1;
  padding: 0 20px;
`
type StatisticsFilterBarProps = {
  onApplyFilter: (dateStart: string, dateEnd: string) => void
  isDataAvailable: boolean
  onExportCsv: (dateStart: string, dateEnd: string) => void
}

const isValidDate = (value: Date | null): value is Date => value !== null && !Number.isNaN(value.valueOf())

const isValidDateTimePeriod = (dateStart: Date | null, dateEnd: Date | null): boolean =>
  isValidDate(dateStart) && isValidDate(dateEnd) && dateStart.valueOf() <= dateEnd.valueOf()

const StatisticsFilterBar = ({
  onApplyFilter,
  isDataAvailable,
  onExportCsv,
}: StatisticsFilterBarProps): ReactElement => {
  const { t } = useTranslation('statistics')
  const [dateStart, setDateStart] = useState<Date | null>(defaultStartDate.toLocalDate())
  const [dateEnd, setDateEnd] = useState<Date | null>(defaultEndDate.toLocalDate())

  return (
    <StickyBottomBar>
      <InputContainer>
        <StyledFormGroup label={t('start')} inline>
          <CustomDatePicker
            value={dateStart}
            error={!isValidDate(dateStart)}
            maxDate={dateEnd ?? defaultStartDate.toLocalDate()}
            textFieldSlotProps={{
              size: 'small',
              sx: {
                '.MuiPickersSectionList-root': {
                  padding: '5px 0',
                },
              },
            }}
            onChange={date => {
              setDateStart(date)
            }}
          />
        </StyledFormGroup>
        <StyledFormGroup label={t('end')} inline>
          <CustomDatePicker
            value={dateEnd}
            error={!isValidDate(dateEnd)}
            textFieldSlotProps={{
              size: 'small',
              sx: {
                '.MuiPickersSectionList-root': {
                  padding: '5px 0',
                },
              },
            }}
            maxDate={new Date()}
            onChange={date => {
              setDateEnd(date)
            }}
          />
        </StyledFormGroup>
        <Tooltip disabled={isValidDateTimePeriod(dateStart, dateEnd)} content={t('invalidStartOrEnd')}>
          <Button
            icon='tick'
            text={t('applyFilter')}
            intent='success'
            onClick={() => {
              if (isValidDate(dateStart) && isValidDate(dateEnd)) {
                onApplyFilter(formatDate(dateStart, filterDateFormat), formatDate(dateEnd, filterDateFormat))
              }
            }}
            disabled={!isValidDateTimePeriod(dateStart, dateEnd)}
          />
        </Tooltip>
      </InputContainer>
      <Tooltip disabled={isDataAvailable} content={t('noDataAvailableForExport')}>
        <Button
          icon='floppy-disk'
          text={t('exportToCsv')}
          intent='primary'
          onClick={() => {
            if (isValidDate(dateStart) && isValidDate(dateEnd)) {
              onExportCsv(dateStart.toLocaleDateString(), dateEnd.toLocaleDateString())
            }
          }}
          disabled={!isDataAvailable}
        />
      </Tooltip>
    </StickyBottomBar>
  )
}

export default StatisticsFilterBar
