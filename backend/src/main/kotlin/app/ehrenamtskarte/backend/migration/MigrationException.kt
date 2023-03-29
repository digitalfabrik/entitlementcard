package app.ehrenamtskarte.backend.migration

class MigrationException(migration: Migration, reason: String) : Exception("Migration ${migration.name} failed: $reason")
