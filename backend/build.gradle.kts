/*
 * This file was generated by the Gradle 'init' task.
 *
 * This generated file contains a sample Kotlin application project to get you started.
 */

/**
 * The exposed_version (taken from gradle.properties)
 */
val exposedVersion: String by project

plugins {
    // Apply the Kotlin JVM plugin to add support for Kotlin.
    id("org.jetbrains.kotlin.jvm") version "1.9.10"
    id("org.jlleitschuh.gradle.ktlint") version "11.5.1"
    id("com.google.protobuf") version "0.9.4"
    id("org.jetbrains.kotlinx.kover") version "0.8.3"
    id("com.expediagroup.graphql") version "8.3.0"
    // Apply the application plugin to add support for building a CLI application.
    application
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.google.protobuf:protobuf-kotlin:4.27.5")
    implementation("com.github.ajalt.clikt:clikt:3.5.4")
    implementation("org.jetbrains.kotlinx:kotlinx-html-jvm:0.11.0")
    implementation("io.javalin:javalin:6.3.0")
    testImplementation("io.javalin:javalin-testtools:6.3.0")
    implementation("com.google.code.gson:gson:2.10.1")
    implementation("org.slf4j:slf4j-simple:2.0.7")
    implementation("org.apache.commons:commons-text:1.10.0")
    implementation("org.simplejavamail:simple-java-mail:8.1.3")
    implementation("org.piwik.java.tracking:matomo-java-tracker:3.4.0")

    implementation("com.expediagroup:graphql-kotlin-schema-generator:6.5.3")
    testImplementation("com.expediagroup:graphql-kotlin-client:6.5.3")

    implementation("com.graphql-java:graphql-java-extended-scalars:20.2")
    // Align versions of all Kotlin components
    implementation(platform("org.jetbrains.kotlin:kotlin-bom"))

    // Use the Kotlin JDK 8 standard library.
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("io.ktor:ktor-client-core-jvm:2.3.9")
    implementation("io.ktor:ktor-client-cio-jvm:2.3.9")

    // Use the Kotlin json serialisation library
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.2")

    // Use the Kotlin test library.
    testImplementation("org.jetbrains.kotlin:kotlin-test")
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
    testImplementation("org.junit.jupiter:junit-jupiter-params:5.10.0")
    testImplementation("io.mockk:mockk:1.13.11")

    implementation("org.jetbrains.exposed:exposed-core:$exposedVersion")
    implementation("org.jetbrains.exposed:exposed-dao:$exposedVersion")
    implementation("org.jetbrains.exposed:exposed-jdbc:$exposedVersion")
    implementation("org.jetbrains.exposed:exposed-java-time:$exposedVersion")
    implementation("org.postgresql:postgresql:42.7.3")
    implementation("com.kohlschutter.junixsocket:junixsocket-core:2.7.0")
    implementation("com.kohlschutter.junixsocket:junixsocket-common:2.7.0")

    implementation("net.postgis:postgis-jdbc:2021.1.0")

    implementation("org.apache.commons:commons-csv:1.10.0")
    implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-xml:2.15.2")
    implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-yaml:2.15.2")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.15.2")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.15.2")
    implementation("de.grundid.opendatalab:geojson-jackson:1.14")

    implementation("com.eatthepath:java-otp:0.4.0") // dynamic card verification
    implementation("com.auth0:java-jwt:4.4.0") // JSON web tokens
    implementation("at.favre.lib:bcrypt:0.10.2")

    implementation("org.bouncycastle:bcpkix-jdk18on:1.78.1")

    implementation("com.google.zxing:core:3.5.2") // QR-Codes

    testImplementation(platform("org.testcontainers:testcontainers-bom:1.19.8"))
    testImplementation("org.testcontainers:testcontainers")
    testImplementation("org.testcontainers:postgresql")
    // Replace the library version used in testcontainers to avoid vulnerability
    testImplementation("org.apache.commons:commons-compress:1.26.2")
}

ktlint {
    filter {
        exclude { it.file.path.contains("$buildDir/generated/") }
    }
}

sourceSets {
    main {
        proto {
            srcDir("../specs")
        }
    }
}

protobuf {
    generateProtoTasks {
        all().forEach {
            it.builtins {
                create("kotlin")
            }
        }
    }
}

application {
    // Define the main class for the application.
    mainClass.set("app.ehrenamtskarte.backend.EntryPointKt")
}

kover {
    reports {
        filters {
            includes {
                classes("app.ehrenamtskarte.backend.*")
            }
        }
    }
}

tasks.withType<JavaExec>().configureEach {
    systemProperties = properties
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions.jvmTarget = "17"
}
tasks.withType<JavaCompile> {
    targetCompatibility = "17"
}

tasks.register<Copy>("copyStyle") {
    from("$rootDir/ehrenamtskarte-maplibre-style/style.json")
    into("$buildDir/resources/main/styles")
}

tasks.named("classes") {
    dependsOn(tasks.named("copyStyle"))
}

tasks.test {
    dependsOn("graphqlGenerateTestClient")
    useJUnitPlatform()
    environment("JWT_SECRET", "HelloWorld")
    environment("KOBLENZ_PEPPER", "123456789ABC")
}

tasks.graphqlGenerateTestClient {
    schemaFile.set(rootDir.parentFile.resolve("specs/backend-api.graphql"))
    packageName.set("app.ehrenamtskarte.backend.generated")
    queryFiles.setFrom(fileTree("src/test/resources/graphql"))
}
