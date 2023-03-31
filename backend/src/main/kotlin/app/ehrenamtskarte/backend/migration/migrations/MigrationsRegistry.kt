package app.ehrenamtskarte.backend.migration.migrations

object MigrationsRegistry {
    fun getAllMigrations() = arrayOf(
        V1_InitializeMigrations(),
        V2_Baseline(),
        V3_AddTestColumn(),
        V4_RemoveTestColumn(),
        V5_FirstProductionMigration()
    )
}
