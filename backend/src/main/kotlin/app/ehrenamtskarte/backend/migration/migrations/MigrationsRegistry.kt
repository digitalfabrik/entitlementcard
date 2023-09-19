package app.ehrenamtskarte.backend.migration.migrations

object MigrationsRegistry {
    fun getAllMigrations() = arrayOf(
        V0001_Baseline(),
        V0002_DropCaseSensitiveEmailConstraint(),
        V0003_AddFirstActivationDate(),
        V0004_AddNotificationSettings(),
        V0005_AddRegionApplicationActivation(),
        V0006_AddStoreCreatedDate(),
        V0007_AddStartDay()
    )
}
