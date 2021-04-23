import {Button, Card, H4, IResizeEntry, ResizeSensor} from "@blueprintjs/core";
import {format} from "date-fns";
import React, {FunctionComponent, useState} from "react";
import styled from "styled-components";
import {getApplications_applications as Application} from "../../graphql/applications/__generated__/getApplications";
import JsonFieldView, {JsonField} from "./JsonFieldView";

interface Props {
    applications: Application[],
    token: string
}

const CARD_PADDING = 20
const COLLAPSED_HEIGHT = 250

const ApplicationViewCard = styled(Card)<{collapsed: boolean, contentHeight: number}>`
    transition: height 0.2s;
    height: ${props => props.collapsed ? COLLAPSED_HEIGHT : props.contentHeight + 2*CARD_PADDING}px;
    overflow: hidden;
    margin: 10px;
    padding: 0px;
    position: relative;
    min-width: 200px;
`

const ExpandContainer = styled.div<{ collapsed: boolean }>`
    background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 100%);
    opacity: ${props => props.collapsed ? '1' : '0'};
    position: absolute;
    top: 0px;
    transition: opacity 0.2s;
    bottom: 0px;
    width: 100%;
    display: flex;
    justify-content: center;
    cursor: pointer;
    align-items: flex-end;
    padding: ${CARD_PADDING}px;
    pointer-events: ${props => props.collapsed ? 'all' : 'none'};
`

const ApplicationView: FunctionComponent<{ application: Application, token: string }> = ({application, token}) => {
    const {createdDate: createdDateString, jsonValue, id} = application
    const createdDate = new Date(createdDateString)
    const jsonField: JsonField = JSON.parse(jsonValue)
    const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/application/${id}`
    const [collapsed, setCollapsed] = useState(false)
    const [height, setHeight] = useState(0)

    const handleResize = (entries: IResizeEntry[]) => {
        setHeight(entries[0].contentRect.height)
        if (height === 0 && entries[0].contentRect.height > COLLAPSED_HEIGHT)
            setCollapsed(true)
    }

    return <ApplicationViewCard elevation={2} collapsed={collapsed} contentHeight={height}>
        <ExpandContainer onClick={() => setCollapsed(false)} collapsed={collapsed}>
            <Button icon='caret-down'>Mehr anzeigen</Button>
        </ExpandContainer>
        <ResizeSensor onResize={handleResize}>
            <div style={{overflow: 'visible', padding: `${CARD_PADDING}px`}}>
                <H4>Antrag vom {format(createdDate, 'dd.MM.yyyy, HH:mm')}</H4>
                <JsonFieldView jsonField={jsonField} baseUrl={baseUrl} token={token} key={0}/>
                <div
                    style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '20px'}}>
                    {height > COLLAPSED_HEIGHT ?
                        <Button onClick={() => setCollapsed(true)} icon='caret-up'>Weniger anzeigen</Button> : null}
                    <Button onClick={() => alert(application.id)} intent='danger' icon='trash'>
                        Bewerbung löschen
                    </Button>
                </div>
            </div>
        </ResizeSensor>
    </ApplicationViewCard>;
}

const ApplicationsOverview = (props: Props) => {
    return <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
        {props.applications.map(application => <ApplicationView key={application.id} application={application}
                                                                token={props.token}/>)}
    </div>
}

export default ApplicationsOverview