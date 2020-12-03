package xyz.elitese.ehrenamtskarte.webservice.schema.types

import graphql.schema.DataFetchingEnvironment
import xyz.elitese.ehrenamtskarte.webservice.dataloader.CATEGORY_LOADER_NAME
import xyz.elitese.ehrenamtskarte.webservice.dataloader.CONTACT_LOADER_NAME
import xyz.elitese.ehrenamtskarte.webservice.dataloader.PHYSICAL_STORE_LOADER_NAME


data class AcceptingStore(
        val id: Int,
        val name: String,
        val contactId: Int,
        val categoryId: Int
) {

    suspend fun physicalStore(dataFetchingEnvironment: DataFetchingEnvironment): PhysicalStore? {
        return dataFetchingEnvironment.getDataLoader<Int, PhysicalStore?>(PHYSICAL_STORE_LOADER_NAME)
                .load(id).join()
    }

    suspend fun contact(dataFetchingEnvironment: DataFetchingEnvironment): Contact {
        return dataFetchingEnvironment.getDataLoader<Int, Contact>(CONTACT_LOADER_NAME)
                .load(contactId).join()
    }

    suspend fun category(dataFetchingEnvironment: DataFetchingEnvironment): Category {
        return dataFetchingEnvironment.getDataLoader<Int, Category>(CATEGORY_LOADER_NAME)
                .load(categoryId).join()
    }
}
