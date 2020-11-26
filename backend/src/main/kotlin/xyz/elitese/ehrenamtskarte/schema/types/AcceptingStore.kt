package xyz.elitese.ehrenamtskarte.schema.types

import graphql.schema.DataFetchingEnvironment
import xyz.elitese.ehrenamtskarte.dataloader.CONTACT_LOADER_NAME


data class AcceptingStore(
        val id: Long,
        val name: String,
        val contactId: Long
) {

    suspend fun contact(dataFetchingEnvironment: DataFetchingEnvironment): Contact {
        return dataFetchingEnvironment.getDataLoader<Long, Contact>(CONTACT_LOADER_NAME)
                .load(contactId).join()
    }
}
