import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
} from '@mui/material'
import { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { FreinetAgency } from '../../../generated/graphql'
import BaseCheckbox from '../../../mui-modules/base/BaseCheckbox'
import SettingsCard, { SettingsCardButtonBox } from '../../user-settings/SettingsCard'

const WordBreakingTableCell = styled(TableCell)({
  wordBreak: 'break-all',
  borderBottom: 0,
})

type FreinetSettingsCardProps = {
  agencyInformation: FreinetAgency
  onSave: (dataTransferActivated: boolean) => void
  dataTransferActivated: boolean
  setDataTransferActivated: (dataTransferActivated: boolean) => void
}

const FreinetSettingsCard = ({
  agencyInformation,
  onSave,
  setDataTransferActivated,
  dataTransferActivated,
}: FreinetSettingsCardProps): ReactElement => {
  const { t } = useTranslation('regionSettings')
  const { agencyId, apiAccessKey, agencyName } = agencyInformation

  return (
    <SettingsCard title={t('freinetHeadline')}>
      <Typography component='p'>
        <Trans i18nKey='regionSettings:freinetExplanation' />
      </Typography>
      <TableContainer>
        <Table sx={{ width: '100%', my: 4 }} size='small'>
          <TableHead>
            <TableRow>
              <TableCell>{t('freinetAgencyName')}</TableCell>
              <TableCell>{t('freinetAgencyId')}</TableCell>
              <TableCell>{t('freinetAgencyAccessKey')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <WordBreakingTableCell>{agencyName}</WordBreakingTableCell>
              <WordBreakingTableCell>{agencyId}</WordBreakingTableCell>
              <WordBreakingTableCell>{apiAccessKey}</WordBreakingTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <BaseCheckbox
        checked={dataTransferActivated}
        onChange={checked => setDataTransferActivated(checked)}
        label={t('freinetActivateDataTransferCheckbox')}
        hasError={false}
        errorMessage={undefined}
      />
      <SettingsCardButtonBox>
        <Button onClick={() => onSave(dataTransferActivated)}>{t('save')}</Button>
      </SettingsCardButtonBox>
    </SettingsCard>
  )
}

export default FreinetSettingsCard
