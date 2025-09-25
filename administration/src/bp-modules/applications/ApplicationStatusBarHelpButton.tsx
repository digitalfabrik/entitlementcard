import { H4, Popover } from '@blueprintjs/core'
import { Help } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const HelpButton = styled(IconButton)`
  margin: 0 10px;
`

const Description = styled.ul`
  margin: 4px 0;
`

const Headline = styled(H4)`
  text-align: center;
`

const PopoverContent = styled.div`
  padding: 10px;
`

const ApplicationStatusHelpButton = (): ReactElement => {
  const { t } = useTranslation('applicationsOverview')
  return (
    <Popover
      content={
        <PopoverContent>
          <Headline>{t('whichStatusMeansWhat')}</Headline>
          <Description>
            <li>
              <b>{t('statusBarAll')}:</b>
              <Description>
                {t('acceptedDescription')}
                <br />
                {t('cardCouldBeCreated')}
              </Description>
            </li>
            <li>
              <b>{t('statusBarRejected')}:</b>
              <Description>
                {t('rejectedDescription')}
                <br />
                {t('applicationCouldBeDeleted')}
              </Description>
            </li>
            <li>
              <b>{t('statusBarWithdrawn')}:</b>
              <Description>
                {t('withdrawnDescription')}
                <br />
                {t('applicationCouldBeDeleted')}
              </Description>
            </li>
            <li>
              <b>{t('statusBarOpen')}:</b>
              <Description>
                {t('pendingDescription')}
                <br />
                {t('cardShouldNotYetBeCreated')}
              </Description>
            </li>
          </Description>
        </PopoverContent>
      }>
      <HelpButton>
        <Help />
      </HelpButton>
    </Popover>
  )
}

export default ApplicationStatusHelpButton
