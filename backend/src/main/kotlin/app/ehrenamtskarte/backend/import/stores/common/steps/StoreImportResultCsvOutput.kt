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
    override fun execute(input: StoreImportReturnResultModel): StoreImportReturnResultModel {
        val outputPath = config.project.importResultOutput
        if (!outputPath.isNullOrBlank()) {
            writeCsvWithImportResult(outputPath, input)
        }
        return input
    }

    private fun writeCsvWithImportResult(outputPath: String, result: StoreImportReturnResultModel) {
        val logger = LoggerFactory.getLogger(StoreImportResultCsvOutput::class.java)
        try {
            val fileExists = Files.exists(Paths.get(outputPath))
            Files.newBufferedWriter(
                Paths.get(outputPath),
                java.nio.file.StandardOpenOption.CREATE,
                java.nio.file.StandardOpenOption.APPEND,
            ).use { writer ->
                val format = CSVFormat.RFC4180.builder()
                    .apply {
                        if (!fileExists) {
                            setHeader(
                                "Date",
                                "StoresTotal",
                                "StoresCreated",
                                "StoresDeleted",
                                "StoresUntouched",
                            )
                        }
                    }
                    .get()
                format.print(writer).use { printer ->
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
