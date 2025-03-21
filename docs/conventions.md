# Conventions

## Contents

- [Naming](#naming)
- [Commit Messages and Pull Requests Names](#commit-messages-and-pull-request-names)
- [Reviews](#reviews)
- [Versioning](#versioning)

## Naming

We follow the following styles for the different languages:
- TypeScript/JSX: [Airbnb Style](https://github.com/airbnb/javascript/tree/master/react)
- Dart: [Effective Dart](https://dart.dev/effective-dart/style)
- Kotlin: [Kotlin Style Guide](https://kotlinlang.org/docs/coding-conventions.html)

## Commit Messages and Pull Request Names

Commit messages should have the following schema:
`<issue number>: Your commit message`, e.g. `1234: Add commit message documentation`

Commit messages and PR names should be short but concise and explain what was done.
Always use present tense (`Add` instead of `Added`).

See [this guide](https://github.com/erlang/otp/wiki/Writing-good-commit-messages) for a general reference on how to
write good commit messages and pull request names.

## Branch Names

Branch names should use lower-kebab-case and be prefixed with the issue number:
`<issue number>-branch-name`, e.g. `1234-commit-message-documentation`

_Note: Branch names (and PR names) do NOT have to match the issue title. Instead, try to be short and concise to focus
on the actual work done._

## Reviews

We use the following emoji code for reviewing:

- :+1: or `:+1:` This is great! It always feels good when somebody likes your work. Show them!
- :question: or `:question:` I have a question / can you clarify?
- :x: or `:x:` This has to change. It’s possibly an error or strongly violates existing conventions.
- :wrench: or `:wrench:` This is a well-meant suggestion. Take it or leave it.
- :upside_down_face: or `:upside_down_face:` This is a nitpick. Normally related to a small formatting or stylizing detail that shouldn’t block moving forward.
- :thought_balloon: or `:thought_balloon:` I’m just thinking out loud here. Something doesn’t necessarily have to change, but I want to make sure to share my thoughts.
- :clown_face: or `:clown_face:` This is a complaint about something with no obvious answer, not necessarily a problem originating from changes.

## Versioning

Versions consist of a version name and a version code and are set in [version.json](../version.json).

### Version Name

We use the [calver schema](https://calver.org) `YYYY.MM.PATCH` for versioning.
`PATCH` is a counter for the number of releases in the corresponding month starting with 0.

Examples:

- First versions of 2024: `2024.1.0`, `2024.1.1`, `2024.1.2`.
- First version of February 2024: `2024.2.0`.

### Version Code

An additional consecutive version code is used for unique identification in the app stores.
The version code has to be incremented for every new release uploaded to the stores.
