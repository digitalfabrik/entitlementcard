import {useMutation} from "@apollo/client";
import {Alert, Button, Card, H4, IResizeEntry, ResizeSensor} from "@blueprintjs/core";
import {format} from "date-fns";
import React, {FunctionComponent, useState} from "react";
import styled from "styled-components";
import {getApplications_applications as Application} from "../../graphql/applications/__generated__/getApplications";
import JsonFieldView, {JsonField} from "./JsonFieldView";
import {DELETE_APPLICATION} from "../../graphql/applications/mutations";
import {AppToaster} from "../AppToaster";
import FlipMove from "react-flip-move";

interface Props {
    applications: Application[],
    token: string
}

const CARD_PADDING = 20
const COLLAPSED_HEIGHT = 250

const ApplicationViewCard = styled(Card)<{ collapsed: boolean, contentHeight: number }>`
    transition: height 0.2s;
    height: ${props => props.collapsed ? COLLAPSED_HEIGHT : props.contentHeight + 2 * CARD_PADDING}px;
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

const ApplicationView: FunctionComponent<{ application: Application, token: string, gotDeleted: () => void }> =
    ({application, token, gotDeleted}) => {
        const {createdDate: createdDateString, jsonValue, id} = application
        const createdDate = new Date(createdDateString)
        const jsonField: JsonField = JSON.parse(jsonValue)
        const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/application/${id}`
        const [collapsed, setCollapsed] = useState(false)
        const [height, setHeight] = useState(0)
        const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
        const [deleteApplication, {loading}] = useMutation(DELETE_APPLICATION, {
            onError: (error) => {
                console.error(error)
                AppToaster.show({intent: "danger", message: "Etwas ist schief gelaufen."})
            },
            onCompleted: ({deleted}: { deleted: boolean }) => {
                if (deleted) gotDeleted()
                else {
                    console.error("Delete operation returned false.")
                    AppToaster.show({intent: "danger", message: "Etwas ist schief gelaufen."})
                }
            }
        });

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
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: '20px'
                        }}>
                        {height > COLLAPSED_HEIGHT ?
                            <Button onClick={() => setCollapsed(true)} icon='caret-up'>Weniger anzeigen</Button> : null}
                        <Button onClick={() => setDeleteDialogOpen(true)} intent='danger' icon='trash'>
                            Antrag löschen
                        </Button>
                        <Alert cancelButtonText="Abbrechen"
                               confirmButtonText="Antrag löschen"
                               icon="trash"
                               intent='danger'
                               isOpen={deleteDialogOpen}
                               loading={loading}
                               onCancel={() => setDeleteDialogOpen(false)}
                               onConfirm={() => deleteApplication({variables: {applicationId: application.id}})}>
                            <p>Möchten Sie den Antrag unwiderruflich löschen?</p>
                        </Alert>
                    </div>
                </div>
            </ResizeSensor>
        </ApplicationViewCard>;
    }

// Necessary for FlipMove, as it cannot handle functional components
class ApplicationViewComponent extends React.Component<{ application: Application, token: string, gotDeleted: () => void }> {
    render() {
        const {application, token, gotDeleted} = this.props
        return <ApplicationView application={application} token={token} gotDeleted={gotDeleted}/>
    }
}

const ApplicationsOverview = (props: Props) => {
    const [updatedApplications, setUpdatedApplications] = useState(props.applications)

    return <FlipMove style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
        {updatedApplications.map(application =>
            <ApplicationViewComponent key={application.id} application={application} token={props.token}
                                      gotDeleted={() => setUpdatedApplications(
                                          updatedApplications.filter(a => a !== application)
                                      )}/>)}
    </FlipMove>
}

export default ApplicationsOverview