import { Button, Card, H3, TextArea } from '@blueprintjs/core'
import { Tooltip2 } from '@blueprintjs/popover2'
import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'

import defaultErrorMap from '../../errors/DefaultErrorMap'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { GraphQlExceptionCode, useUpdateDataPolicyMutation } from '../../generated/graphql'
import { useAppToaster } from '../AppToaster'

const Content = styled.div`
  padding: 0 6rem;
  width: 100%;
  z-index: 0;
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
`
const Label = styled(H3)`
  text-align: center;
  margin: 15px;
`
const ButtonBar = styled(({ stickyTop: number, ...rest }) => <Card {...rest} />)<{ stickyTop: number }>`
  width: 100%;
  padding: 15px;
  background: #fafafa;
  position: sticky;
  z-index: 1;
  top: ${props => props.stickyTop}px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  & button {
    margin: 5px;
  }
`

const CharCounter = styled.span<{ $hasError: boolean }>`
  text-align: center;
  align-self: flex-start;
  color: ${props => (props.$hasError ? 'red' : 'black')};
  margin: 15px;
`

type RegionOverviewProps = {
  dataPrivacyPolicy: string
  regionId: number
}

const MAX_CHARS = 20000

const RegionOverview = ({ dataPrivacyPolicy, regionId }: RegionOverviewProps): ReactElement => {
  const appToaster = useAppToaster()
  const [dataPrivacyText, setDataPrivacyText] = useState<string>(dataPrivacyPolicy)
  const [updateDataPrivacy, { loading }] = useUpdateDataPolicyMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: () => appToaster?.show({ intent: 'success', message: 'Datenschutzerklärung erfolgreich geändert.' }),
  })
  const maxCharsExceeded = dataPrivacyText.length > MAX_CHARS

  const onSave = () => updateDataPrivacy({ variables: { regionId, text: dataPrivacyText } })

  const { title: errorMessage } = defaultErrorMap({
    code: GraphQlExceptionCode.InvalidDataPolicySize,
    maxSize: MAX_CHARS,
  })

  return (
    <>
      <ButtonBar stickyTop={0}>
        <Tooltip2 disabled={!maxCharsExceeded} content={errorMessage}>
          <Button
            disabled={maxCharsExceeded}
            icon='floppy-disk'
            text='Speichern'
            intent='success'
            onClick={onSave}
            loading={loading}
          />
        </Tooltip2>
      </ButtonBar>
      <Content>
        <Label>Datenschutzerklärung</Label>
        <TextArea
          fill={true}
          onChange={e => setDataPrivacyText(e.target.value)}
          value={dataPrivacyText}
          large
          rows={20}
          placeholder={'Fügen Sie hier Ihre Datenschutzerklärung ein...'}
        />
        <CharCounter $hasError={maxCharsExceeded}>
          {dataPrivacyText.length}/{MAX_CHARS}
        </CharCounter>
      </Content>
    </>
  )
}
export default RegionOverview
