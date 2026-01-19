import { FilterAlt, SaveAlt } from '@mui/icons-material'
import type { FormControlLabelProps } from '@mui/material'
import { Button, FormControlLabel, Stack, Tooltip, styled } from '@mui/material'
import { grey } from '@mui/material/colors'
import { formatDate } from 'date-fns/format'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CustomDatePicker from '../../../components/CustomDatePicker'
import type { CustomDatePickerTextFieldProps } from '../../../components/CustomDatePicker'
import { defaultEndDate, defaultStartDate } from '../constants'

const filterDateFormat = 'yyyy-MM-dd'

const InputContainer = styled('div')`
  flex-direction: row;
  display: flex;
  justify-content: start;
  align-items: center;
  flex: 1;
  gap: 16px;
`
const isValidDate = (value: Date | null): value is Date =>
  value !== null && !Number.isNaN(value.valueOf())

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
  isDataAvailable,
  onApplyFilter,
  onExportCsv,
}: {
  isDataAvailable: boolean
  onApplyFilter: (dateStart: string, dateEnd: string) => void
  onExportCsv: (dateStart: string, dateEnd: string) => void
}): ReactElement => {
  const { t } = useTranslation('statistics')
  const [dateStart, setDateStart] = useState<Date | null>(defaultStartDate.toLocalDate())
  const [dateEnd, setDateEnd] = useState<Date | null>(defaultEndDate.toLocalDate())

  return (
    <Stack
      sx={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 2,
        padding: 2,
        backgroundColor: grey[50],
      }}
    >
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
        <Tooltip
          title={isValidDateTimePeriod(dateStart, dateEnd) ? undefined : t('invalidStartOrEnd')}
        >
          <Button
            variant='contained'
            color='primary'
            startIcon={<FilterAlt />}
            onClick={() => {
              if (isValidDate(dateStart) && isValidDate(dateEnd)) {
                onApplyFilter(
                  formatDate(dateStart, filterDateFormat),
                  formatDate(dateEnd, filterDateFormat),
                )
              }
            }}
            disabled={!isValidDateTimePeriod(dateStart, dateEnd)}
          >
            {t('applyFilter')}
          </Button>
        </Tooltip>
      </InputContainer>
      <Tooltip title={isDataAvailable ? undefined : t('noDataAvailableForExport')}>
        <div>
          <Button
            variant='contained'
            startIcon={<SaveAlt />}
            onClick={() => {
              if (isValidDate(dateStart) && isValidDate(dateEnd)) {
                onExportCsv(dateStart.toLocaleDateString(), dateEnd.toLocaleDateString())
              }
            }}
            disabled={!isDataAvailable}
          >
            {t('exportToCsv')}
          </Button>
        </div>
      </Tooltip>
    </Stack>
  )
}

export default StatisticsFilterBar
