import { H2 } from "@blueprintjs/core";
import React from "react";
import {getApplications_applications as Application} from "../../graphql/applications/__generated__/getApplications";

interface Props {
    applications: Application[]
}

const ApplicationsOverview = (props: Props) => {
    return <H2>Eingehende Anträge</H2>
}

export default ApplicationsOverview