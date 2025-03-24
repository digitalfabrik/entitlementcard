package app.ehrenamtskarte.backend.util

import java.io.File

object CsvGenerator {
    fun generateCsvFile(
        fileName: String,
        vararg data: List<String>,
    ): File {
        val file = File(fileName)
        file.bufferedWriter().use { out ->
            for (row in data) {
                out.write(row.joinToString(","))
                out.newLine()
            }
        }
        return file
    }
}
