package xyz.elitese.ehrenamtskarte.webservice.schema.types

import graphql.schema.DataFetchingEnvironment
import xyz.elitese.ehrenamtskarte.webservice.dataloader.CATEGORY_LOADER_NAME
import xyz.elitese.ehrenamtskarte.webservice.dataloader.CONTACT_LOADER_NAME
import xyz.elitese.ehrenamtskarte.webservice.dataloader.PHYSICAL_STORE_LOADER_NAME


data class AcceptingStore(
        val id: Long,
        val name: String,
        val contactId: Long,
        val categoryId: Long
) {

    suspend fun physicalStore(dataFetchingEnvironment: DataFetchingEnvironment): PhysicalStore? {
        return dataFetchingEnvironment.getDataLoader<Long, PhysicalStore?>(PHYSICAL_STORE_LOADER_NAME)
                .load(id).join()
    }

    suspend fun contact(dataFetchingEnvironment: DataFetchingEnvironment): Contact {
        return dataFetchingEnvironment.getDataLoader<Long, Contact>(CONTACT_LOADER_NAME)
                .load(contactId).join()
    }

    suspend fun category(dataFetchingEnvironment: DataFetchingEnvironment): Category {
        return dataFetchingEnvironment.getDataLoader<Long, Category>(CATEGORY_LOADER_NAME)
                .load(categoryId).join()
    }
}
