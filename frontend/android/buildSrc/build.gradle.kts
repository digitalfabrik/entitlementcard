plugins {
    `kotlin-dsl`
    kotlin("plugin.serialization") version "2.1.21"
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(gradleApi())
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.8.0")
}
