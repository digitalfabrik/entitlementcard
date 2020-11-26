package xyz.elitese.ehrenamtskarte.schema.types

import graphql.schema.DataFetchingEnvironment
import xyz.elitese.ehrenamtskarte.dataloader.CATEGORY_LOADER_NAME
import xyz.elitese.ehrenamtskarte.dataloader.CONTACT_LOADER_NAME


data class AcceptingStore(
        val id: Long,
        val name: String,
        val contactId: Long,
        val categoryId: Long
) {

    suspend fun contact(dataFetchingEnvironment: DataFetchingEnvironment): Contact {
        return dataFetchingEnvironment.getDataLoader<Long, Contact>(CONTACT_LOADER_NAME)
                .load(contactId).join()
    }

    suspend fun category(dataFetchingEnvironment: DataFetchingEnvironment): Category {
        return dataFetchingEnvironment.getDataLoader<Long, Category>(CATEGORY_LOADER_NAME)
                .load(categoryId).join()
    }
}
