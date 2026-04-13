package app.ehrenamtskarte.backend.import.stores.common.steps

import app.ehrenamtskarte.backend.graphql.stores.types.StoreImportReturnResultModel
import app.ehrenamtskarte.backend.import.stores.ImportConfig
import app.ehrenamtskarte.backend.import.stores.PipelineStep
import org.apache.commons.csv.CSVFormat
import org.slf4j.LoggerFactory
import java.nio.file.Files
import java.nio.file.Paths
import java.time.LocalDate

class StoreImportResultCsvOutput(config: ImportConfig) :
    PipelineStep<StoreImportReturnResultModel, StoreImportReturnResultModel>(config) {
    private val logger = LoggerFactory.getLogger(StoreImportResultCsvOutput::class.java)

    override fun execute(input: StoreImportReturnResultModel): StoreImportReturnResultModel {
        val outputPath = config.project.importLogFilePath
        if (!outputPath.isNullOrBlank()) {
            writeCsvWithImportResult(outputPath, input)
        }
        return input
    }

    private fun writeCsvWithImportResult(outputPath: String, result: StoreImportReturnResultModel) {
        try {
            val path = Paths.get(outputPath)
            val isNewFile = !Files.exists(path)
            Files.newBufferedWriter(
                path,
                java.nio.file.StandardOpenOption.CREATE,
                java.nio.file.StandardOpenOption.APPEND,
            ).use { writer ->
                CSVFormat.RFC4180.builder()
                    .apply {
                        if (isNewFile) {
                            setHeader(
                                "Date",
                                "StoresTotal",
                                "StoresCreated",
                                "StoresDeleted",
                                "StoresUntouched",
                            )
                        }
                    }
                    .get().print(writer).use { printer ->
                        printer.printRecord(
                            LocalDate.now(config.project.timezone),
                            result.storesCreated + result.storesUntouched,
                            result.storesCreated,
                            result.storesDeleted,
                            result.storesUntouched,
                        )
                    }
            }
        } catch (e: Exception) {
            logger.error("Error writing import result CSV:", e)
        }
    }
}
