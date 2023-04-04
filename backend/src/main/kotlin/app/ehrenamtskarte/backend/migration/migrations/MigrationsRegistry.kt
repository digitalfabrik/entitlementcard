package app.ehrenamtskarte.backend.migration.migrations

object MigrationsRegistry {
    fun getAllMigrations() = arrayOf(
        V0001_Baseline(),
        V0002_DropCaseSensitiveEmailConstraint(),
        V0003_AddFirstActivationDate()
    )
}
