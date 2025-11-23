import { Close } from '@mui/icons-material'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { Button, Link, Stack, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { Card, getFullNameValidationErrorMessage, isFullNameValid, isValid } from '../../cards/Card'
import CardTextField from '../../cards/extensions/components/CardTextField'
import ClearInputButton from '../../cards/extensions/components/ClearInputButton'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import ConfirmDialog from '../../mui-modules/application/ConfirmDialog'
import BaseCheckbox from '../../mui-modules/base/BaseCheckbox'
import FormAlert from '../../mui-modules/base/FormAlert'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { removeMultipleSpaces } from '../../util/helper'
import ExtensionForms from '../cards/ExtensionForms'
import { DataPrivacyAcceptingStatus } from './constants'

type CardSelfServiceFormProps = {
  card: Card
  updateCard: (card: Partial<Card>) => void
  dataPrivacyAccepted: DataPrivacyAcceptingStatus
  setDataPrivacyAccepted: (status: DataPrivacyAcceptingStatus) => void
  generateCards: () => Promise<void>
}

const CardSelfServiceForm = ({
  card,
  updateCard,
  dataPrivacyAccepted,
  setDataPrivacyAccepted,
  generateCards,
}: CardSelfServiceFormProps): ReactElement => {
  const projectConfig = useContext(ProjectConfigContext)
  const { t } = useTranslation('selfService')
  const [formSendAttempt, setFormSendAttempt] = useState(false)
  const [openDataPrivacy, setOpenDataPrivacy] = useState<boolean>(false)
  const [openReferenceInformation, setOpenReferenceInformation] = useState<boolean>(false)
  const [_, setSearchParams] = useSearchParams()
  const cardValid = isValid(card, projectConfig.card, { expirationDateNullable: true })
  const { enqueueSnackbar } = useSnackbar()
  const { viewportSmall } = useWindowDimensions()

  const createKoblenzPass = async () => {
    setFormSendAttempt(true)
    if (dataPrivacyAccepted === DataPrivacyAcceptingStatus.untouched) {
      setDataPrivacyAccepted(DataPrivacyAcceptingStatus.denied)
    }
    if (!cardValid || dataPrivacyAccepted !== DataPrivacyAcceptingStatus.accepted) {
      enqueueSnackbar(<FormAlert isToast errorMessage={t('atLeastOneInputIsInvalid')} />, { variant: 'error' })
      return
    }
    await generateCards()
    setSearchParams(undefined, { replace: true })
  }

  return (
    <>
      <Stack key={card.id} sx={{ marginBottom: 3, gap: 2 }}>
        <CardTextField
          id='name-input'
          label={t('firstNameLastName')}
          placeholder='Erika Musterfrau'
          autoFocus
          forceError={formSendAttempt}
          value={card.fullName}
          onChange={fullName => updateCard({ fullName: removeMultipleSpaces(fullName) })}
          showError={!isFullNameValid(card)}
          inputProps={{
            sx: { paddingRight: 0 },
            endAdornment: (
              <ClearInputButton
                viewportSmall={viewportSmall}
                onClick={() => updateCard({ fullName: '' })}
                input={card.fullName}
              />
            ),
          }}
          errorMessage={getFullNameValidationErrorMessage(card.fullName)}
        />
        <ExtensionForms card={card} updateCard={updateCard} forceError={formSendAttempt} />
        <Button
          color='inherit'
          variant='text'
          onClick={() => setOpenReferenceInformation(true)}
          sx={{ width: 'fit-content' }}
          startIcon={<InfoOutlined />}>
          {' '}
          <Typography>{t('whereToFindReferenceNumber')}</Typography>
        </Button>
        <BaseCheckbox
          checked={dataPrivacyAccepted === DataPrivacyAcceptingStatus.accepted}
          label={
            <Typography>
              {t('iAccept')}
              <Button
                color='info'
                variant='text'
                sx={{ textDecoration: 'underline', px: 0, verticalAlign: 'unset' }}
                onClick={() => setOpenDataPrivacy(true)}>
                {t('datePrivacyAgreement')}
              </Button>
              .
            </Typography>
          }
          onChange={() =>
            setDataPrivacyAccepted(
              dataPrivacyAccepted === DataPrivacyAcceptingStatus.accepted
                ? DataPrivacyAcceptingStatus.denied
                : DataPrivacyAcceptingStatus.accepted
            )
          }
          hasError={dataPrivacyAccepted === DataPrivacyAcceptingStatus.denied}
          errorMessage={t('pleaseAcceptPrivacyPolicy')}
        />
      </Stack>
      <Button
        color='secondary'
        sx={{ width: 'fit-content' }}
        onClick={createKoblenzPass}
        variant='contained'
        size='large'>
        {t('createKoblenzPass')}
      </Button>
      <ConfirmDialog
        open={openReferenceInformation}
        title={t('whereToFindReferenceNumber')}
        color='secondary'
        confirmButtonText={t('misc:close')}
        confirmButtonIcon={<Close />}
        id='reference-information-dialog'
        onConfirm={() => setOpenReferenceInformation(false)}
        onClose={() => setOpenReferenceInformation(false)}
        showCancelButton={false}>
        <Typography>
          {t('whereToFindReferenceNumberExplanation')} <br />
          {t('moreInformationAndExamples')}
          <Link
            href='https://www.koblenz.de/leben-in-koblenz/soziales/koblenzpass/#accordion-2-4'
            target='_blank'
            rel='noreferrer'>
            www.koblenz.de/koblenzpass
          </Link>
          . <br />
          <br /> {t('forQuestionsPleaseContact')}
          <Link href='mailto:koblenzpass@stadt.koblenz.de'>koblenzpass@stadt.koblenz.de</Link>.
        </Typography>
      </ConfirmDialog>
      <ConfirmDialog
        confirmButtonText={t('misc:close')}
        confirmButtonIcon={<Close />}
        showCancelButton={false}
        open={openDataPrivacy}
        color='secondary'
        title={projectConfig.dataPrivacyHeadline}
        id='data-privacy-dialog'
        onConfirm={() => setOpenDataPrivacy(false)}
        onClose={() => setOpenDataPrivacy(false)}>
        <projectConfig.dataPrivacyContent />
      </ConfirmDialog>
    </>
  )
}

export default CardSelfServiceForm
