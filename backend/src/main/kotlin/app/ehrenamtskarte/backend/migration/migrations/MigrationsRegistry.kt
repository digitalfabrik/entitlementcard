package app.ehrenamtskarte.backend.migration.migrations

object MigrationsRegistry {
    fun getAllMigrations() = arrayOf(
        V0001_Baseline(),
        V0002_DropCaseSensitiveEmailConstraint(),
        V0003_AddFirstActivationDate(),
        V0004_AddNotificationSettings(),
        V0005_AddRegionApplicationActivation(),
        V0006_AddStoreCreatedDate(),
        V0007_AddStartDay(),
        V0008_IncreaseAdministratorEmailLength(),
        V0009_HashPasswordResetKey(),
        V0010_ApplicationNote(),
        V0011_AddRegionCardConfirmationMailActivation(),
        V0012_AddApplicationCardCreated(),
        V0013_FixExpirationDateGoldCard(),
        V0014_CreateUserEntitlementsTable(),
        V0015_UpdateRoleRegionCombinationConstraint(),
        V0016_MakeCardIssuerIdColumnNullable(),
        V0017_AlterUserEntitlementsUserHashConstraint(),
        V0018_AlterRegionIdentifierConstraint(),
        V0019_AddEntitlementIdColumnToCards(),
        V0020_AddApiTokenTable(),
        V0021_AlterTokenHashColumn(),
        V0022_AddTypeToApiToken(),
        V0023_DropTypeDefaultOfApiToken(),
        V0024_AddNewRoleToRoleRegionCombinationConstraint()
    )
}
