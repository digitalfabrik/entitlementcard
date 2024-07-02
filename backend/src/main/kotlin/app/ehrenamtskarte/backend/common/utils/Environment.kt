package app.ehrenamtskarte.backend.common.utils

// This helper class was created to enable mocking getenv in Tests
class Environment {
    companion object {
        fun getVariable(name: String): String? = System.getenv(name)
    }
}
