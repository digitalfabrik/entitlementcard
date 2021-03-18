package app.ehrenamtskarte.backend.application.webservice.utils;

import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField;
import com.expediagroup.graphql.annotations.GraphQLIgnore

interface JsonFieldSerializable {
    @GraphQLIgnore
    fun toJsonField(): JsonField
}
