import { Tooltip } from '@blueprintjs/core'
import { FilterAlt, SaveAlt } from '@mui/icons-material'
import { Button, FormControlLabel, Typography } from '@mui/material'
import type { FormControlLabelProps } from '@mui/material'
import { formatDate } from 'date-fns/format'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import StickyBottomBar from '../../StickyBottomBar'
import CustomDatePicker from '../../components/CustomDatePicker'
import type { CustomDatePickerTextFieldProps } from '../../components/CustomDatePicker'
import { defaultEndDate, defaultStartDate } from '../constants'

const filterDateFormat = 'yyyy-MM-dd'

const InputContainer = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: start;
  align-items: center;
  flex: 1;
  gap: 16px;
`
type StatisticsFilterBarProps = {
  onApplyFilter: (dateStart: string, dateEnd: string) => void
  isDataAvailable: boolean
  onExportCsv: (dateStart: string, dateEnd: string) => void
}

const isValidDate = (value: Date | null): value is Date => value !== null && !Number.isNaN(value.valueOf())

const isValidDateTimePeriod = (dateStart: Date | null, dateEnd: Date | null): boolean =>
  isValidDate(dateStart) && isValidDate(dateEnd) && dateStart.valueOf() <= dateEnd.valueOf()

const formControlStyle: FormControlLabelProps['sx'] = {
  marginLeft: 0,
  marginRight: 0,
  gap: '8px',
}

const datePickerTextFieldProps: CustomDatePickerTextFieldProps = {
  size: 'small',
  sx: {
    width: '180px',
  },
}

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
        <FormControlLabel
          label={t('start')}
          labelPlacement='start'
          sx={formControlStyle}
          control={
            <CustomDatePicker
              value={dateStart}
              error={!isValidDate(dateStart)}
              maxDate={dateEnd ?? defaultStartDate.toLocalDate()}
              textFieldSlotProps={datePickerTextFieldProps}
              onChange={date => {
                setDateStart(date)
              }}
            />
          }
        />
        <FormControlLabel
          label={t('end')}
          labelPlacement='start'
          sx={formControlStyle}
          control={
            <CustomDatePicker
              value={dateEnd}
              error={!isValidDate(dateEnd)}
              textFieldSlotProps={datePickerTextFieldProps}
              maxDate={new Date()}
              onChange={date => {
                setDateEnd(date)
              }}
            />
          }
        />
        <Tooltip disabled={isValidDateTimePeriod(dateStart, dateEnd)} content={t('invalidStartOrEnd')}>
          <Button
            variant='contained'
            color='success'
            startIcon={<FilterAlt />}
            onClick={() => {
              if (isValidDate(dateStart) && isValidDate(dateEnd)) {
                onApplyFilter(formatDate(dateStart, filterDateFormat), formatDate(dateEnd, filterDateFormat))
              }
            }}
            disabled={!isValidDateTimePeriod(dateStart, dateEnd)}>
            <Typography variant='button'>{t('applyFilter')}</Typography>
          </Button>
        </Tooltip>
      </InputContainer>
      <Tooltip disabled={isDataAvailable} content={t('noDataAvailableForExport')}>
        <Button
          variant='contained'
          startIcon={<SaveAlt />}
          onClick={() => {
            if (isValidDate(dateStart) && isValidDate(dateEnd)) {
              onExportCsv(dateStart.toLocaleDateString(), dateEnd.toLocaleDateString())
            }
          }}
          disabled={!isDataAvailable}>
          <Typography variant='button'>{t('exportToCsv')}</Typography>
        </Button>
      </Tooltip>
    </StickyBottomBar>
  )
}

export default StatisticsFilterBar
