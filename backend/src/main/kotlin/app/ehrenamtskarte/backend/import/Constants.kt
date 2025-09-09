package app.ehrenamtskarte.backend.import

const val COUNTRY_CODE = "de"
const val STATE = "Bayern"

// Postal code lookup and address sanitation fails/does not really make sense for a "Postfach"
const val STREET_EXCLUDE_PATTERN = "Postfach"

const val MISCELLANEOUS_CATEGORY_ID = 9
const val ALTERNATIVE_MISCELLANEOUS_CATEGORY_ID = 99
