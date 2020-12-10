package xyz.elitese.ehrenamtskarte.importer.converters

import com.beust.klaxon.Converter
import com.beust.klaxon.JsonValue

val doubleConverter = object: Converter {

    override fun canConvert(cls: Class<*>)
            = cls == String::class.java

    override fun toJson(value: Any): String {
        TODO("Not yet implemented")
    }

    override fun fromJson(jv: JsonValue) = jv.string!!.toDouble()

}
