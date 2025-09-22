package app.ehrenamtskarte.backend.shared.utils
import org.slf4j.Logger

fun isDevEnv(): Boolean = Environment.getVariable("APP_ENV") == "dev"

fun Logger.devInfo(msg: String) {
    if (isDevEnv() && isInfoEnabled) {
        info(msg)
    }
}

fun Logger.devDebug(msg: String) {
    if (isDevEnv() && isDebugEnabled) {
        debug(msg)
    }
}

fun Logger.devError(msg: String) {
    if (isDevEnv() && isErrorEnabled) {
        error(msg)
    }
}

fun Logger.devWarn(msg: String) {
    if (isDevEnv() && isWarnEnabled) {
        warn(msg)
    }
}
