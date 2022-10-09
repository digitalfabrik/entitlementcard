package app.ehrenamtskarte.backend.auth.webservice.schema.types

enum class Role(val db_value: String) {
    // A Project Admin has the right to (de)nominate Region Admins for each region in his project
    PROJECT_ADMIN("PROJECT_ADMIN"),

    // A Region Admin has the right to (de)nominate Region Managers for his project. He also has the right to create cards
    // for his project.
    REGION_ADMIN("REGION_ADMIN"),

    // A Region Manager has the right to create cards and manage applications in his project.
    REGION_MANAGER("REGION_MANAGER"),

    // Users with this role do not have any rights.
    NO_RIGHTS("NO_RIGHTS");

    companion object {
        fun fromDbValue(db_value: String): Role? {
            return values().find { it.db_value == db_value }
        }
    }
}
