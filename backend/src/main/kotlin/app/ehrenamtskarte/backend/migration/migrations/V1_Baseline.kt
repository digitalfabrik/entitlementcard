package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

internal class V1_Baseline() : Migration() {
    override val migrate: Statement = {
        exec(
            """
            /* TODO: Add output from pg_dump from production server and remove the following dummy text. */
            CREATE TABLE IF NOT EXISTS projects (id SERIAL PRIMARY KEY, project VARCHAR(50) NOT NULL);
            ALTER TABLE projects ADD CONSTRAINT projects_project_unique UNIQUE (project);
            CREATE TABLE IF NOT EXISTS regions (id SERIAL PRIMARY KEY, "projectId" INT NOT NULL, "regionIdentifier" CHAR(5) NULL, website VARCHAR(400) NOT NULL, "name" VARCHAR(100) NOT NULL, prefix VARCHAR(30) NOT NULL, "dataPrivacyPolicy" VARCHAR(20000) NULL, CONSTRAINT fk_regions_projectid__id FOREIGN KEY ("projectId") REFERENCES projects(id) ON DELETE RESTRICT ON UPDATE RESTRICT);
            ALTER TABLE regions ADD CONSTRAINT regions_regionidentifier_unique UNIQUE ("regionIdentifier");
            CREATE TABLE IF NOT EXISTS administrators (id SERIAL PRIMARY KEY, email VARCHAR(100) NOT NULL, "projectId" INT NOT NULL, "regionId" INT NULL, "role" VARCHAR(32) NOT NULL, "passwordHash" bytea NULL, "passwordResetKey" VARCHAR(100) NULL, "passwordResetKeyExpiry" TIMESTAMP NULL, deleted BOOLEAN NOT NULL, CONSTRAINT fk_administrators_projectid__id FOREIGN KEY ("projectId") REFERENCES projects(id) ON DELETE RESTRICT ON UPDATE RESTRICT, CONSTRAINT fk_administrators_regionid__id FOREIGN KEY ("regionId") REFERENCES regions(id) ON DELETE RESTRICT ON UPDATE RESTRICT, CONSTRAINT roleRegionCombinationConstraint CHECK ((("regionId" IS NULL) AND ("role" IN ('PROJECT_ADMIN', 'NO_RIGHTS'))) OR (("regionId" IS NOT NULL) AND ("role" IN ('REGION_MANAGER', 'REGION_ADMIN', 'NO_RIGHTS')))), CONSTRAINT deletedIfAndOnlyIfNoRights CHECK (((deleted = TRUE) AND ("role" = 'NO_RIGHTS')) OR ((deleted = FALSE) AND ("role" <> 'NO_RIGHTS'))));
            CREATE TABLE IF NOT EXISTS cards (id SERIAL PRIMARY KEY, "activationSecretHash" bytea NULL, "totpSecret" bytea NULL, "expirationDay" BIGINT NULL, "issueDate" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP) NOT NULL, revoked BOOLEAN NOT NULL, "regionId" INT NOT NULL, "issuerId" INT NOT NULL, "cardInfoHash" bytea NOT NULL, "codeType" INT NOT NULL, CONSTRAINT fk_cards_regionid__id FOREIGN KEY ("regionId") REFERENCES regions(id) ON DELETE RESTRICT ON UPDATE RESTRICT, CONSTRAINT fk_cards_issuerid__id FOREIGN KEY ("issuerId") REFERENCES administrators(id) ON DELETE RESTRICT ON UPDATE RESTRICT, CONSTRAINT CodeTypeConstraint CHECK ((("activationSecretHash" IS NULL) AND ("totpSecret" IS NULL) AND ("codeType" = 0)) OR (("activationSecretHash" IS NOT NULL) AND ("codeType" = 1))));
            ALTER TABLE cards ADD CONSTRAINT cards_cardinfohash_unique UNIQUE ("cardInfoHash");
            CREATE TABLE IF NOT EXISTS applications (id SERIAL PRIMARY KEY, "regionId" INT NOT NULL, "jsonValue" TEXT NOT NULL, "createdDate" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP) NOT NULL, CONSTRAINT fk_applications_regionid__id FOREIGN KEY ("regionId") REFERENCES regions(id) ON DELETE RESTRICT ON UPDATE RESTRICT);
            CREATE TABLE IF NOT EXISTS applicationverifications (id SERIAL PRIMARY KEY, "applicationId" INT NOT NULL, "contactEmailAddress" VARCHAR(300) NOT NULL, "contactName" VARCHAR(300) NOT NULL, "organizationName" VARCHAR(300) NOT NULL, "verifiedDate" TIMESTAMP NULL, "rejectedDate" TIMESTAMP NULL, "accessKey" VARCHAR(100) NOT NULL, CONSTRAINT fk_applicationverifications_applicationid__id FOREIGN KEY ("applicationId") REFERENCES applications(id) ON DELETE RESTRICT ON UPDATE RESTRICT, CONSTRAINT notVerifiedAndRejected CHECK (NOT (("verifiedDate" IS NOT NULL) AND ("rejectedDate" IS NOT NULL))));
            ALTER TABLE applicationverifications ADD CONSTRAINT applicationverifications_accesskey_unique UNIQUE ("accessKey");
            CREATE TABLE IF NOT EXISTS addresses (id SERIAL PRIMARY KEY, street VARCHAR(200) NULL, "postalCode" VARCHAR(10) NOT NULL, "location" VARCHAR(200) NOT NULL, "countryCode" VARCHAR(2) NOT NULL);
            CREATE TABLE IF NOT EXISTS contacts (id SERIAL PRIMARY KEY, email VARCHAR(100) NULL, telephone VARCHAR(100) NULL, website VARCHAR(200) NULL);
            CREATE TABLE IF NOT EXISTS categories (id SERIAL PRIMARY KEY, "name" VARCHAR(50) NOT NULL);
            CREATE TABLE IF NOT EXISTS acceptingstores (id SERIAL PRIMARY KEY, "name" VARCHAR(150) NOT NULL, description VARCHAR(2500) NULL, "contactId" INT NOT NULL, "categoryId" INT NOT NULL, "projectId" INT NOT NULL, "regionId" INT NULL, CONSTRAINT fk_acceptingstores_contactid__id FOREIGN KEY ("contactId") REFERENCES contacts(id) ON DELETE RESTRICT ON UPDATE RESTRICT, CONSTRAINT fk_acceptingstores_categoryid__id FOREIGN KEY ("categoryId") REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE RESTRICT, CONSTRAINT fk_acceptingstores_projectid__id FOREIGN KEY ("projectId") REFERENCES projects(id) ON DELETE RESTRICT ON UPDATE RESTRICT, CONSTRAINT fk_acceptingstores_regionid__id FOREIGN KEY ("regionId") REFERENCES regions(id) ON DELETE RESTRICT ON UPDATE RESTRICT);
            CREATE TABLE IF NOT EXISTS physicalstores (id SERIAL PRIMARY KEY, coordinates GEOMETRY(Point, 4326) NOT NULL, "addressId" INT NOT NULL, "storeId" INT NOT NULL, CONSTRAINT fk_physicalstores_addressid__id FOREIGN KEY ("addressId") REFERENCES addresses(id) ON DELETE RESTRICT ON UPDATE RESTRICT, CONSTRAINT fk_physicalstores_storeid__id FOREIGN KEY ("storeId") REFERENCES acceptingstores(id) ON DELETE RESTRICT ON UPDATE RESTRICT);
            """.trimIndent()
        )
    }
}
