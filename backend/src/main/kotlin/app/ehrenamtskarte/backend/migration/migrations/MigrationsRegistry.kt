package app.ehrenamtskarte.backend.migration.migrations

object MigrationsRegistry {
    fun getAllMigrations() = arrayOf(
        V1_Baseline(),
        V2_FirstProductionMigration()
    )
}
