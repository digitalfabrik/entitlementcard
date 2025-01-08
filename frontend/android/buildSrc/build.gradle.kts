plugins {
    `kotlin-dsl`
    kotlin("plugin.serialization") version "1.9.23"
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(gradleApi())
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.8.0")
}
