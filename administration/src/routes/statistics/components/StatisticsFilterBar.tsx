import { FilterAlt, SaveAlt } from '@mui/icons-material'
import type { FormControlLabelProps } from '@mui/material'
import { Button, FormControlLabel, Stack, Tooltip, styled } from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Temporal } from 'temporal-polyfill'

import type { CustomDatePickerTextFieldProps } from '../../../components/CustomDatePicker'
import CustomDatePicker from '../../../components/CustomDatePicker'
import { defaultEndDate, defaultStartDate } from '../constants'

const InputContainer = styled('div')`
  flex-direction: row;
  display: flex;
  justify-content: start;
  align-items: center;
  flex: 1;
  gap: 16px;
`

const isValidDateTimePeriod = (
  dateStart: Temporal.PlainDate | null,
  dateEnd: Temporal.PlainDate | null,
): boolean =>
  dateStart !== null && dateEnd !== null && Temporal.PlainDate.compare(dateStart, dateEnd) <= 0

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
  onApplyFilter: (dateStart: Temporal.PlainDate, dateEnd: Temporal.PlainDate) => void
  onExportCsv: (dateStart: Temporal.PlainDate, dateEnd: Temporal.PlainDate) => void
}): ReactElement => {
  const { t } = useTranslation('statistics')
  const [dateStart, setDateStart] = useState<Temporal.PlainDate | null>(defaultStartDate)
  const [dateEnd, setDateEnd] = useState<Temporal.PlainDate | null>(defaultEndDate)

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
              error={!(dateStart !== null)}
              maxDate={dateEnd ?? undefined}
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
              error={!(dateEnd !== null)}
              textFieldSlotProps={datePickerTextFieldProps}
              maxDate={Temporal.Now.plainDateISO()}
              onChange={date => {
                setDateEnd(date)
              }}
            />
          }
        />
        <Tooltip
          title={isValidDateTimePeriod(dateStart, dateEnd) ? undefined : t('invalidStartOrEnd')}
        >
          <div>
            <Button
              variant='contained'
              color='primary'
              startIcon={<FilterAlt />}
              onClick={() => {
                if (dateStart !== null && dateEnd !== null) {
                  onApplyFilter(dateStart, dateEnd)
                }
              }}
              disabled={!isValidDateTimePeriod(dateStart, dateEnd)}
            >
              {t('applyFilter')}
            </Button>
          </div>
        </Tooltip>
      </InputContainer>
      <Tooltip title={isDataAvailable ? undefined : t('noDataAvailableForExport')}>
        <div>
          <Button
            variant='contained'
            startIcon={<SaveAlt />}
            onClick={() => {
              if (dateStart !== null && dateEnd !== null) {
                onExportCsv(dateStart, dateEnd)
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
