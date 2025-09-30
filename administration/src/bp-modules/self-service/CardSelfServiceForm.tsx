import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { Stack } from '@mui/material'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { Card, getFullNameValidationErrorMessage, isFullNameValid, isValid } from '../../cards/Card'
import CardTextField from '../../cards/extensions/components/CardTextField'
import ClearInputButton from '../../cards/extensions/components/ClearInputButton'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import BasicDialog from '../../mui-modules/application/BasicDialog'
import BaseCheckbox from '../../mui-modules/base/BaseCheckbox'
import FormAlert from '../../mui-modules/base/FormAlert'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { removeMultipleSpaces } from '../../util/helper'
import { useAppToaster } from '../AppToaster'
import ExtensionForms from '../cards/ExtensionForms'
import { ActionButton } from './components/ActionButton'
import { IconTextButton } from './components/IconTextButton'
import { UnderlineTextButton } from './components/UnderlineTextButton'
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
  const appToaster = useAppToaster()
  const showErrorMessage = formSendAttempt
  const { viewportSmall } = useWindowDimensions()

  const createKoblenzPass = async () => {
    setFormSendAttempt(true)
    if (dataPrivacyAccepted === DataPrivacyAcceptingStatus.untouched) {
      setDataPrivacyAccepted(DataPrivacyAcceptingStatus.denied)
    }
    if (!cardValid || dataPrivacyAccepted !== DataPrivacyAcceptingStatus.accepted) {
      appToaster?.show({
        message: <FormAlert isToast errorMessage={t('atLeastOneInputIsInvalid')} />,
        intent: 'danger',
      })
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
          value={card.fullName}
          onChange={fullName => updateCard({ fullName: removeMultipleSpaces(fullName) })}
          showError={!isFullNameValid(card) && showErrorMessage}
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
        <ExtensionForms card={card} updateCard={updateCard} showRequired={formSendAttempt} />
        <IconTextButton onClick={() => setOpenReferenceInformation(true)}>
          <InfoOutlined />
          {t('whereToFindReferenceNumber')}
        </IconTextButton>
        <BaseCheckbox
          checked={dataPrivacyAccepted === DataPrivacyAcceptingStatus.accepted}
          label={
            <>
              {t('iAccept')}
              <UnderlineTextButton onClick={() => setOpenDataPrivacy(true)}>
                {t('datePrivacyAgreement')}
              </UnderlineTextButton>
              .
            </>
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
      <ActionButton onClick={createKoblenzPass} variant='contained' size='large'>
        {t('createKoblenzPass')}
      </ActionButton>
      <BasicDialog
        open={openReferenceInformation}
        maxWidth='lg'
        onUpdateOpen={setOpenReferenceInformation}
        title={t('whereToFindReferenceNumber')}
        content={
          <>
            {t('whereToFindReferenceNumberExplanation')} <br />
            {t('moreInformationAndExamples')}
            <a
              href='https://www.koblenz.de/leben-in-koblenz/soziales/koblenzpass/#accordion-2-4'
              target='_blank'
              rel='noreferrer'>
              www.koblenz.de/koblenzpass
            </a>
            . <br />
            <br /> {t('forQuestionsPleaseContact')}
            <a href='mailto:koblenzpass@stadt.koblenz.de'>koblenzpass@stadt.koblenz.de</a>.
          </>
        }
      />
      <BasicDialog
        open={openDataPrivacy}
        maxWidth='md'
        onUpdateOpen={setOpenDataPrivacy}
        title={projectConfig.dataPrivacyHeadline}
        content={<projectConfig.dataPrivacyContent />}
      />
    </>
  )
}

export default CardSelfServiceForm
