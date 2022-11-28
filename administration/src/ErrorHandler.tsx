import {Button, Card, H3 } from '@blueprintjs/core';
import React, {ReactElement} from 'react';

type ErrorHandlerProps = {
    refetch: ()=>void
}

const ErrorHandler = ({refetch}: ErrorHandlerProps): ReactElement => {
    return (
        <Card>
            <H3>Ein Fehler ist aufgetreten.</H3>
            <Button intent='primary' onClick={() => refetch()}>
                Erneut versuchen
            </Button>
        </Card>
    )
};

export default ErrorHandler;
