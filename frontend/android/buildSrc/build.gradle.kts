plugins {
    `kotlin-dsl`
    kotlin("plugin.serialization") version "2.2.0"
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(gradleApi())
    // Newest version does not work with flutter 3.32.6
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")
}
