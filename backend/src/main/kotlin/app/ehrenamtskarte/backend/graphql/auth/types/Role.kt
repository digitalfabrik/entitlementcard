package app.ehrenamtskarte.backend.graphql.auth.types

import app.ehrenamtskarte.backend.graphql.shared.exceptions.InvalidRoleException

enum class Role(val db_value: String) {
    // A Project Admin has the right to (de)nominate Region Admins for each region in his project
    PROJECT_ADMIN("PROJECT_ADMIN"),

    // A project store manager has the right to import stores in his project.
    PROJECT_STORE_MANAGER("PROJECT_STORE_MANAGER"),

    // A Region Admin has the right to (de)nominate Region Managers for his project. He also has the right to create cards
    // for his project.
    REGION_ADMIN("REGION_ADMIN"),

    // A Region Manager has the right to create cards and manage applications in his project.
    REGION_MANAGER("REGION_MANAGER"),

    // EXTERNAL_VERIFIED_API_USER
    EXTERNAL_VERIFIED_API_USER("EXTERNAL_VERIFIED_API_USER"),

    // Users with this role do not have any rights.
    NO_RIGHTS("NO_RIGHTS"),
    ;

    companion object {
        fun fromDbValue(db_value: String): Role =
            values().find { it.db_value == db_value } ?: throw InvalidRoleException()
    }
}
