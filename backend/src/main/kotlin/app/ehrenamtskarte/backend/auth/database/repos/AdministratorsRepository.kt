package app.ehrenamtskarte.backend.auth.database.repos

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.auth.webservice.schema.types.AuthData
import app.ehrenamtskarte.backend.common.database.sortByKeys

object AdministratorsRepository {

    fun findByIds(ids: List<Int>) =
        AdministratorEntity.find { Administrators.id inList ids }.sortByKeys({ it.id.value }, ids)

    // TODO check password
    fun findByAuthData(authData: AuthData) =
        AdministratorEntity.find { Administrators.username eq authData.username }.singleOrNull()
}
