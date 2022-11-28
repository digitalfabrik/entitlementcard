import {Button, Card, H4, TextArea} from '@blueprintjs/core';
import React, {ReactElement, useState} from 'react';
import styled from 'styled-components';
import {useUpdateDataPolicyMutation} from "../../generated/graphql";
import {useAppToaster} from "../AppToaster";

const Content = styled.div`
  padding: 0 6rem;
  width: 100%;
  z-index: 0;
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
`
const Label = styled(H4)`
  text-align: center;
`
const ButtonBar = styled(({stickyTop: number, ...rest}) => <Card {...rest} />)<{ stickyTop: number }>`
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

type RegionOverviewProps = {
    dataPrivacyPolicy: string
    regionId: number
}

const RegionOverview = ({dataPrivacyPolicy, regionId}: RegionOverviewProps): ReactElement => {
        const appToaster = useAppToaster()
    const [dataPrivacyText, setDataPrivacyText] = useState<string>(dataPrivacyPolicy);
    const [updateDataPrivacy] = useUpdateDataPolicyMutation({
    })

    const onSave = async() => {
        try {
        const result = await updateDataPrivacy({variables: {regionId,text: dataPrivacyText}})
        if (result.errors) {
            console.error(result.errors)
            appToaster?.show({ intent: 'danger', message: 'Fehler beim Speicher der Datenschutzerklärung' })
        } else {
            appToaster?.show({
                intent: 'success',
                message: 'Datenschutzerklärungerfolgreich geändert.',
            })
        }
    } catch (e) {
        console.error(e)
        appToaster?.show({ intent: 'danger', message: 'Fehler beim Speicher der Datenschutzerklärung' })
    }
    }

return (
    <>
        <ButtonBar stickyTop={0}>
            <Button
                icon='lock'
                text='Speichern'
                intent='success'
                onClick={onSave}
            />
        </ButtonBar>
        <Content>
            <Label>Datenschutzerklärung</Label>
            <TextArea fill={true} onChange={e => setDataPrivacyText(e.target.value)} value={dataPrivacyText} large
                      rows={20} placeholder={'Fügen sie hier ihre Datenschutzerklärung ein...'}/>
        </Content>
    </>
);
}
;

export default RegionOverview;
