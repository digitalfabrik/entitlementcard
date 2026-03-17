# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

**Digitale Berechtigungskarte** — a whitelabel platform for digital entitlement/benefit cards in Germany. Three main components:

- **`/frontend`** — Flutter mobile app (Android & iOS)
- **`/backend`** — Kotlin/Spring Boot GraphQL + REST API
- **`/administration`** — React/TypeScript web portal
- **`/build-configs`** — Shared whitelabel project constants (Bayern, Nuernberg, Koblenz)
- **`/specs`** — Shared GraphQL schema and Protobuf specs

Root `package.json` has npm workspaces for `administration` and `build-configs`. The backend uses Gradle independently.

## Commands

### Administration (`/administration`)

```bash
npm install                    # Install dependencies
npm run start                  # Dev server + codegen watch
npm run build                  # Production build
npm run lint                   # ESLint + Prettier check
npm run format                 # Auto-fix lint/format issues
npm run ts:check               # TypeScript type check
npm run test                   # Jest unit tests
npm run test:watch             # Jest watch mode
npm run test -- --testPathPattern=<file>  # Single test file
npm run test:e2e               # Playwright e2e tests
npm run check-circular-deps    # Check for circular imports
npm run codegen:gql            # Regenerate GraphQL types
npm run codegen:pb             # Regenerate Protobuf types
```

### Backend (`/backend`)

```bash
./gradlew build                # Build
./gradlew test                 # Run tests
./gradlew ktlintCheck          # Lint
./gradlew ktlintFormat         # Auto-fix lint
./gradlew detekt               # Static analysis
./gradlew run --args="execute" # Start server (port 8000)
```

Database CLI tasks (run via `./gradlew run --args="<cmd>"`):
- `db-migrate` — apply migrations
- `db-recreate` — clear + migrate + import dev data
- `db-import-dev` — load sample/dev data

### Frontend (`/frontend`)

```bash
fvm flutter pub get            # Install dependencies
fvm flutter test               # Run tests
fvm flutter analyze            # Lint
fvm flutter format lib test    # Format
```

### Infrastructure

```bash
docker compose up -d           # Start all services (DB, mail, map tiles, analytics)
```

Services: PostgreSQL+PostGIS (5432), Martin map tiles (5002), Maildev (SMTP 5025 / web 5026), Matomo analytics (5003).

## Architecture

### Whitelabel System

The platform supports multiple projects (Bayern, Nuernberg, Koblenz) via build configurations in `/build-configs`. Each project has its own branding, feature flags, and GraphQL project ID. The administration portal and mobile app adapt their UI/behavior based on the active project config.

### GraphQL

- **Schema** lives in `/specs/backend-api.graphql` (symlinked into `frontend/` and `administration/`)
- **Backend** generates its schema at build time via ExpediaGroup's GraphQL Kotlin plugin
- **Administration** uses `@graphql-codegen` to generate TypeScript types — run `npm run codegen:gql` after schema changes
- **Frontend** uses `flutter_graphql` with generated Dart classes — run `build_runner` after schema changes

### Protobuf

Digital card data is serialized as Protobuf. Specs live in `/specs/`. Run `npm run codegen:pb` (administration) or `dart-protoc-builder` (frontend) to regenerate after `.proto` changes.

### Administration Frontend Structure

Routes are organized as feature modules under `src/routes/`, each typically containing `components/`, `hooks/`, and controller components. Shared UI goes in `src/components/`. GraphQL queries/mutations live alongside the features that use them.

- `src/project-configs/` — Runtime project configuration (maps project IDs to whitelabel configs)
- `src/provider/` — React context providers (auth, snackbar, etc.)
- `src/cards/` — Card generation, QR codes, PDF handling

### Backend Structure

Entry point: `backend/src/main/kotlin/app/ehrenamtskarte/backend/EntryPoint.kt`

The backend exposes both GraphQL (for app + admin portal) and REST endpoints. Database access uses JetBrains Exposed ORM. Migrations are managed as Kotlin code. Auth uses JWT tokens.

## Conventions

- **Commits**: `<issue-number>: <message>` in present tense (e.g., `1234: Add feature`)
- **Branches**: `<issue-number>-branch-name` in kebab-case
- **Versioning**: CalVer `YYYY.MM.PATCH` in `/version.json`
- **Main branch**: `whitelabel`

## CI/CD

CircleCI is the primary CI/CD system (`.circleci/`). Config is composed from `.circleci/src/` and packed into `.circleci/config.yml` — edit the source files, then run `npm run circleci:update-config` from root to regenerate. GitHub Actions (`.github/workflows/pr.yaml`) handles PR validation checks.
