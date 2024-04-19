import { Button, FormGroup } from '@blueprintjs/core'
import { TextField } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'

import PlainDate from '../../../util/PlainDate'
import StickyBottomBar from '../../StickyBottomBar'
import { defaultStartDate } from '../StatisticsController'

const StyledFormGroup = styled(FormGroup)`
  margin: 0 16px 0 0;
  align-self: center;
`

const InputContainer = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: flex-start;
  flex: 1;
  padding: 0 20px;
`
type StatisticsFilterBarProps = {
  onApplyFilter: (dateStart: string, dateEnd: string) => void
}

const StatisticsFilterBar = ({ onApplyFilter }: StatisticsFilterBarProps): ReactElement => {
  // TODO send timestamp or next day for between, error handling for wrong value format in dateField
  const [dateStart, setDateStart] = useState(defaultStartDate)
  const [dateEnd, setDateEnd] = useState(PlainDate.fromLocalDate(new Date()).toString())
  return (
    <StickyBottomBar>
      <InputContainer>
        <StyledFormGroup label='Startzeitraum' inline intent='primary'>
          <TextField
            fullWidth
            type='date'
            required
            size='small'
            error={false}
            value={dateStart}
            sx={{ '& input[value=""]:not(:focus)': { color: 'transparent' }, '& fieldset': { borderRadius: 0 } }}
            inputProps={{
              max: PlainDate.fromLocalDate(new Date()).toString(),
              style: { fontSize: 14, padding: '6px 10px' },
            }}
            onChange={e => setDateStart(e.target.value)}
          />
        </StyledFormGroup>
        <StyledFormGroup label='Endzeitraum' inline>
          <TextField
            fullWidth
            type='date'
            required
            size='small'
            error={false}
            value={dateEnd}
            sx={{ '& input[value=""]:not(:focus)': { color: 'transparent' }, '& fieldset': { borderRadius: 0 } }}
            inputProps={{
              max: PlainDate.fromLocalDate(new Date()).toString(),
              style: { fontSize: 14, padding: '6px 10px' },
            }}
            onChange={e => setDateEnd(e.target.value)}
          />
        </StyledFormGroup>
        <Button
          icon='tick'
          text='Filter anwenden'
          intent='success'
          onClick={() => onApplyFilter(dateStart, dateEnd)}
          disabled={false}
        />
      </InputContainer>
      <Button icon='floppy-disk' text='CSV Export' intent='primary' onClick={undefined} disabled={false} />
    </StickyBottomBar>
  )
}

export default StatisticsFilterBar
