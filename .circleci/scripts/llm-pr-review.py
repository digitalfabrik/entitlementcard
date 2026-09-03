#!/usr/bin/env python3
"""
LLM-based PR review script for CircleCI.

Fetches the PR diff, the commit messages and the labels currently set on
the PR via the GitHub API, sends them to the LiteLLM endpoint for an
entitlementcard-specific review, then posts (or updates) a single comment
on the PR. The step only comments — it never approves or rejects, and it
never changes labels itself.

This script always exits 0 so that LLM or network failures never block
a merge. Errors are printed to stderr and visible in the CI log.

Reviews are triggered by the GitHub Actions workflow in
.github/workflows/llm-pr-review.yml, which reacts to the pull_request event
and starts a review-only CircleCI pipeline.

Required environment variables (injected by CircleCI):
  LLM_REVIEW_PR_NUMBER     Number of the pull request to review, set from the
                           `llm_review_pr_number` pipeline parameter by the
                           GitHub Actions workflow. Empty on any pipeline that
                           workflow did not start, in which case the review is
                           skipped.
  CIRCLE_PROJECT_USERNAME  Repository owner (org or user)
  CIRCLE_PROJECT_REPONAME  Repository name

Required secrets (CircleCI contexts):
  NB_LLM_API_TOKEN         API key for litellm.netzbegruenung.verdigado.net
                           (CircleCI context "digitalfabrik-llm-api")
  DELIVERINO_ACCESS_TOKEN  GitHub App installation access token for the
                           Deliverino app (requested by
                           .circleci/scripts/get_access_token.py, needs the
                           "Pull requests" or "Issues" write permission)
"""

import os
import sys

import requests

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

GITHUB_API_URL = "https://api.github.com"
LITELLM_BASE_URL = "https://litellm.netzbegruenung.verdigado.net"
LITELLM_MODEL = "verdigado-think"

COMMENT_MARKER = "<!-- llm-pr-review -->"

# Maximum diff size to send to the LLM (200 KB). Larger diffs are truncated.
MAX_DIFF_BYTES = 200_000

# Maximum diff size for a single file (20 KB). Larger per-file diffs (e.g.
# regenerated schemas, generated GraphQL/Protobuf code or lock files) are
# replaced by a placeholder so they can't push the interesting files of the
# PR past MAX_DIFF_BYTES.
MAX_FILE_DIFF_BYTES = 20_000

SYSTEM_PROMPT = """
You are a senior full-stack engineer reviewing a pull request for
entitlementcard ("Digitale Berechtigungskarte"), a whitelabel platform for
digital entitlement/benefit cards in Germany (e.g. the Bavarian
Ehrenamtskarte and the Nuremberg/Koblenz Sozialpass). The repository has
three main components plus shared specs:
- `frontend`: a Flutter mobile app (Android & iOS) using graphql_flutter and
  the `provider` package for state management.
- `backend`: a Kotlin/Spring Boot application exposing GraphQL (via
  ExpediaGroup's graphql-kotlin) and REST endpoints, using JetBrains Exposed
  as the database ORM (PostgreSQL/PostGIS) and JWT-based authentication.
- `administration`: a React/TypeScript web portal (MUI, react-router,
  i18next), organized as feature modules under `src/routes`.
- `build-configs`: shared whitelabel project constants for the different
  projects (Bayern, Nuernberg, Koblenz).
- `specs`: the shared GraphQL schema (`backend-api.graphql`) and Protobuf
  definitions for the digital card data, consumed by both `frontend` and
  `administration`.

Analyse the diff, the commit messages and the PR's current labels and
report on:
1. Backend (Kotlin) correctness: null-safety, proper use of Exposed
 transactions (`transaction { ... }`), parameterized queries (never
 string-concatenated SQL), correct coroutine/threading usage around the
 Ktor client, and missing authorization/authentication checks on new or
 changed GraphQL data fetchers and REST endpoints. Also check for correct
 use of Spring: constructor injection for dependencies (the codebase never
 uses field injection via `@Autowired`), correct stereotype annotations
 (`@RestController`/`@Component`/`@Configuration`/`@RestControllerAdvice`)
 instead of manually instantiating beans, new REST endpoints returning
 proper `ResponseEntity`/HTTP status codes, and new error cases reusing
 the existing exception hierarchy (e.g. `UnauthorizedException`,
 `ForbiddenException`, `NotFoundException` in `shared/exceptions`) handled
 centrally via `GlobalExceptionHandler` rather than ad-hoc try/catch
 blocks per endpoint.
2. Administration (React/TypeScript) correctness:
 - Prefer functional components and hooks over class components.
 - Flag `any`, unsafe type assertions (`as X` without justification), or
   missing types on new functions/exported values — the project runs a
   strict `tsc --build` type check.
 - Watch for React hook dependency issues (missing/incorrect deps in
   `useEffect`/`useCallback`/`useMemo`) and obvious state management bugs
   (stale closures, unnecessary re-renders from inline objects/functions
   passed as props).
 - New user-facing strings must go through i18next (`react-i18next`), not
   be hardcoded.
3. Frontend (Flutter/Dart) correctness: follow Effective Dart style, prefer
 immutable widgets, watch for missing `dispose()`/listener cleanup, and
 verify that `provider` state changes don't trigger unnecessary rebuilds.
 Platform-specific code (Android/iOS) should behave consistently unless a
 divergence is clearly intentional and explained.
4. Whitelabel correctness: this is a multi-project (whitelabel) platform.
 New features, strings or assets should not silently hardcode
 project-specific behavior (e.g. project name, colors, feature flags)
 outside of `build-configs`, unless the change is explicitly scoped to one
 project.
5. GraphQL & Protobuf: the schema lives in `specs/backend-api.graphql`
 (symlinked into `frontend` and `administration`); a schema change should
 come with regenerated types (`npm run codegen:gql` in `administration`,
 `build_runner` in `frontend`). Likewise, Protobuf changes in `specs`
 should come with regenerated code (`npm run codegen:pb` /
 `dart-protoc-builder`). Flag a schema/proto change that isn't accompanied
 by the corresponding generated-code diff, unless the file list shows the
 generated files were genuinely unaffected.
6. Code quality gates: `backend` enforces ktlint and detekt
 (`./gradlew ktlintCheck`, `./gradlew detekt`, config in `detekt.yml`);
 `administration` enforces ESLint (Airbnb + typescript-eslint, see
 `eslint.config.mjs` / `eslint.config-base.mjs`) and Prettier via
 `npm run lint`; `frontend` enforces `fvm flutter analyze` and
 `fvm flutter format`. Flag obvious formatting drift or unjustified
 lint-suppression comments (`// ktlint-disable`, `eslint-disable`,
 `// ignore:`).
7. Security: watch for secrets (API keys, tokens, JWT signing keys)
 committed to source, missing input validation on data coming from the
 app/administration API, and unsafe handling of personal data — this
 platform stores volunteers' and cardholders' personal information, so PII
 must be handled carefully (logging, storage, access control).
8. Testing: `backend` uses JUnit (`./gradlew test`, Testcontainers for
 integration tests); `administration` places tests next to the component
 (`Component.test.tsx`) using Jest and React Testing Library; `frontend`
 places tests under `frontend/test`. New or changed behavior should come
 with tests. If a PR changes a shared function's signature, check that all
 call sites (including tests and mocks) were updated.
9. Clean code & maintainability: flag dead code, duplicated logic that
 should be a shared component/hook/util, overly long functions doing too
 many things, unclear naming, and unnecessary complexity. Prefer small,
 focused, well-named units over clever one-offs — this is a long-lived
 project maintained by multiple contributors, so readability beats
 brevity.
10. Obvious typos in code, comments, file paths, identifiers, and
 documentation. Only flag clear spelling mistakes — do not nitpick
 stylistic word choices.
11. Commit message / PR title style. The repository convention (see
 `docs/conventions.md`) is:
 - `<issue number>: Your commit message`, e.g. "1234: Add commit message
   documentation" — the issue number prefix should match the branch name's
   prefix (`<issue-number>-branch-name`).
 - Always present tense ("Add" instead of "Added").
 - The commit message must be generally useful: it should clearly describe
   what changed. Flag messages that are vague ("fix stuff", "update"),
   tautological ("change X to X"), or that don't explain a non-obvious
   change.
 Dependabot commits are exempt from these rules.
12. CircleCI config: `.circleci/config.yml` is auto-generated from
 `.circleci/src/{commands,jobs,workflows}/*.yml` via
 `npm run circleci:update-config`. Flag a PR that edits `.circleci/config.yml`
 directly without a matching change under `.circleci/src`.
13. Labels (see `docs/conventions.md`). The message lists the labels
 currently set on this PR:
 - `backend`, `web`, `native`: should reflect the environments actually
   touched by the diff (backend, administration, frontend respectively).
 - `maintenance`: only for changes with no user-facing effect (CI, dev
   tooling, tests, refactorings, dependency bumps).
 - `exclude-changelog`: changes that should not appear in the release
   notes at all (e.g. release PRs). Only suggest this one when it is
   clearly warranted.
 Anything user-facing needs none of the above; it lands in the default
 "Features, fixes, enhancements" release-notes category. That label list
 may also contain labels unrelated to these conventions (e.g. project
 labels like `Bayern`/`Nuernberg`/`Koblenz`, platform labels like
 `iOS`/`Android`, or priority labels); ignore those and never comment on
 them. Only suggest a label that is missing and clearly warranted by the
 diff, and say nothing about labels at all when the current ones already
 fit the change. If the label list says the labels could not be
 determined, skip this check entirely. Dependabot PRs are exempt.

The message starts with the complete list of files changed in this PR.
The diff itself may be incomplete: oversized per-file diffs are replaced
by an "[omitted]" placeholder and the overall diff may be truncated.
Whether a file is part of the PR must therefore only ever be judged by
the file list, never by the (possibly incomplete) diff. Never claim that
a file, migration, translation or test is missing from the PR when the
file list contains it — if its diff was omitted or truncated, say that
you could not review its content instead.

Be specific and reference file paths and line numbers where possible.
Be concise. Do not approve or reject — provide comments only.
"""


def require_env(name):
    value = os.environ.get(name)
    if not value:
        print(
            f"Error: required environment variable {name!r} is not set", file=sys.stderr
        )
        sys.exit(0)
    return value


def warn(message):
    print(f"Warning: {message}", file=sys.stderr)


def path_from_diff_header(header_line):
    """
    Extracts the file path from a "diff --git a/... b/..." header line,
    e.g. 'diff --git a/setup.py b/setup.py' -> "setup.py".
    """
    return header_line.split(" b/", 1)[-1]


def split_diff_by_file(diff_text):
    """
    Splits a unified diff into a list of per-file chunks, each starting
    with its "diff --git" header line.
    """
    chunks = []
    for chunk in ("\n" + diff_text).split("\ndiff --git "):
        if chunk.strip():
            chunks.append("diff --git " + chunk.rstrip("\n"))
    return chunks


def compress_diff(diff_text):
    """
    Prepares a diff for the LLM without losing track of the changed files:

    - Per-file diffs larger than MAX_FILE_DIFF_BYTES (e.g. regenerated
      GraphQL/Protobuf code or fixtures) are replaced by a placeholder, so a
      single bulky file can't push the rest of the PR past the overall size
      limit.
    - If the result still exceeds MAX_DIFF_BYTES, it is truncated.

    Returns a tuple (changed_files, compressed_diff, truncated).
    """
    changed_files = []
    parts = []
    for chunk in split_diff_by_file(diff_text):
        header_line = chunk.split("\n", 1)[0]
        changed_files.append(path_from_diff_header(header_line))
        chunk_size = len(chunk.encode())
        if chunk_size > MAX_FILE_DIFF_BYTES:
            line_count = chunk.count("\n")
            parts.append(
                f"{header_line}\n"
                f"[diff omitted: {line_count} lines / {chunk_size} bytes — "
                f"too large for review]"
            )
            print(
                f"Omitting diff of {changed_files[-1]} "
                f"({chunk_size} bytes > {MAX_FILE_DIFF_BYTES})."
            )
        else:
            parts.append(chunk)

    compressed = "\n\n".join(parts)
    truncated = False
    if len(compressed.encode()) > MAX_DIFF_BYTES:
        compressed = compressed.encode()[:MAX_DIFF_BYTES].decode(errors="replace")
        truncated = True
        print(f"Diff truncated to {MAX_DIFF_BYTES} bytes for LLM input.")
    return changed_files, compressed, truncated


def main():
    # -------------------------------------------------------------------------
    # Step 0: Determine which pull request to review
    # -------------------------------------------------------------------------

    pr_number = os.environ.get("LLM_REVIEW_PR_NUMBER", "").strip()
    if not pr_number:
        print(
            "Skipping LLM review: LLM_REVIEW_PR_NUMBER is empty, so this "
            "pipeline was not started by the review trigger in "
            ".github/workflows/llm-pr-review.yml."
        )
        return

    print(f"Reviewing PR #{pr_number}.")

    # -------------------------------------------------------------------------
    # Step 1: Read environment
    # -------------------------------------------------------------------------

    repo_owner = require_env("CIRCLE_PROJECT_USERNAME")
    repo_name = require_env("CIRCLE_PROJECT_REPONAME")
    nb_llm_api_token = require_env("NB_LLM_API_TOKEN")
    github_token = require_env("DELIVERINO_ACCESS_TOKEN")

    auth_headers = {
        "Authorization": f"Bearer {github_token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    # -------------------------------------------------------------------------
    # Step 2: Fetch the PR diff from GitHub
    # -------------------------------------------------------------------------

    pr_url = f"{GITHUB_API_URL}/repos/{repo_owner}/{repo_name}/pulls/{pr_number}"
    print(f"Fetching diff from {pr_url} ...")

    try:
        diff_response = requests.get(
            pr_url,
            headers={**auth_headers, "Accept": "application/vnd.github.v3.diff"},
            timeout=30,
        )
    except requests.RequestException as exc:
        warn(f"Could not reach GitHub API: {exc}")
        return

    if diff_response.status_code != 200:
        warn(
            f"Could not fetch diff (HTTP {diff_response.status_code}): "
            f"{diff_response.text[:200]}"
        )
        return

    diff_text = diff_response.text.strip()
    if not diff_text:
        print("No diff found — skipping LLM review.")
        return

    print(f"Diff fetched ({len(diff_text)} chars).")

    changed_files, diff_text, truncated = compress_diff(diff_text)

    # -------------------------------------------------------------------------
    # Step 2b: Fetch the PR commit messages from GitHub
    # -------------------------------------------------------------------------

    commits_url = f"{pr_url}/commits"
    print(f"Fetching commits from {commits_url} ...")

    commit_messages_block = ""
    try:
        commits_response = requests.get(
            commits_url,
            headers=auth_headers,
            timeout=30,
        )
        if commits_response.status_code == 200:
            commit_lines = []
            for commit in commits_response.json():
                sha = commit.get("sha", "")[:8]
                message = commit.get("commit", {}).get("message", "").rstrip()
                commit_lines.append(f"--- commit {sha} ---\n{message}")
            if commit_lines:
                commit_messages_block = "\n\n".join(commit_lines)
                print(f"Fetched {len(commit_lines)} commit message(s).")
        else:
            warn(
                f"Could not fetch commits (HTTP {commits_response.status_code}): "
                f"{commits_response.text[:200]}"
            )
    except requests.RequestException as exc:
        warn(f"Could not fetch commits: {exc}")

    # -------------------------------------------------------------------------
    # Step 2c: Fetch the labels currently set on the PR
    # -------------------------------------------------------------------------

    print(f"Fetching labels from {pr_url} ...")

    current_labels_block = "(could not be determined)"
    try:
        pr_response = requests.get(
            pr_url,
            headers=auth_headers,
            timeout=30,
        )
        if pr_response.status_code == 200:
            label_names = [
                label.get("name", "") for label in pr_response.json().get("labels", [])
            ]
            current_labels_block = (
                "\n".join(f"- {name}" for name in label_names if name) or "(none)"
            )
            print(f"Fetched {len(label_names)} label(s).")
        else:
            warn(
                f"Could not fetch labels (HTTP {pr_response.status_code}): "
                f"{pr_response.text[:200]}"
            )
    except requests.RequestException as exc:
        warn(f"Could not fetch labels: {exc}")

    # -------------------------------------------------------------------------
    # Step 3: Send diff to LiteLLM
    # -------------------------------------------------------------------------

    chat_url = f"{LITELLM_BASE_URL}/v1/chat/completions"
    print(f"Sending diff to LiteLLM ({LITELLM_MODEL}) ...")

    user_content_parts = [
        "Complete list of files changed in this PR:\n\n"
        + "\n".join(f"- {path}" for path in changed_files)
    ]
    if commit_messages_block:
        user_content_parts.append(
            "Commit messages in this PR:\n\n" + commit_messages_block
        )
    user_content_parts.append(
        "Labels currently set on this PR:\n\n" + current_labels_block
    )
    user_content_parts.append("Diff:\n\n" + diff_text)
    user_content = "\n\n".join(user_content_parts)
    if truncated:
        user_content += "\n\n[Diff was truncated to 200 KB]"

    try:
        llm_response = requests.post(
            chat_url,
            headers={
                "Authorization": f"Bearer {nb_llm_api_token}",
                "Content-Type": "application/json",
            },
            json={
                "model": LITELLM_MODEL,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_content},
                ],
            },
            timeout=300,
        )
    except requests.RequestException as exc:
        warn(f"Could not reach LiteLLM: {exc}")
        return

    if llm_response.status_code != 200:
        warn(
            f"LiteLLM returned HTTP {llm_response.status_code}: "
            f"{llm_response.text[:200]}"
        )
        return

    llm_data = llm_response.json()
    review_text = (
        llm_data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
    )
    if not review_text:
        warn("LLM returned an empty review.")
        return

    print("LLM review received.")

    # -------------------------------------------------------------------------
    # Step 4: Find existing bot comment (identified by marker)
    # -------------------------------------------------------------------------

    comments_url = (
        f"{GITHUB_API_URL}/repos/{repo_owner}/{repo_name}/issues/{pr_number}/comments"
    )
    print("Checking for existing LLM review comment ...")

    try:
        comments_response = requests.get(
            comments_url,
            headers=auth_headers,
            timeout=30,
        )
    except requests.RequestException as exc:
        warn(f"Could not fetch comments: {exc}")
        return

    if comments_response.status_code != 200:
        warn(
            f"Could not fetch comments (HTTP {comments_response.status_code}): "
            f"{comments_response.text[:200]}"
        )
        return

    existing_comment_id = None
    for comment in comments_response.json():
        if COMMENT_MARKER in comment.get("body", ""):
            existing_comment_id = comment["id"]
            break

    # -------------------------------------------------------------------------
    # Step 5: Post or update the comment
    # -------------------------------------------------------------------------

    comment_body = (
        f"{COMMENT_MARKER}\n" f"### LLM Review ({LITELLM_MODEL})\n\n" f"{review_text}\n"
    )

    post_headers = {**auth_headers, "Content-Type": "application/json"}

    try:
        if existing_comment_id:
            update_url = (
                f"{GITHUB_API_URL}/repos/{repo_owner}/{repo_name}"
                f"/issues/comments/{existing_comment_id}"
            )
            print(f"Updating existing comment {existing_comment_id} ...")
            resp = requests.patch(
                update_url,
                headers=post_headers,
                json={"body": comment_body},
                timeout=30,
            )
        else:
            print("Posting new comment ...")
            resp = requests.post(
                comments_url,
                headers=post_headers,
                json={"body": comment_body},
                timeout=30,
            )
    except requests.RequestException as exc:
        warn(f"Could not post comment: {exc}")
        return

    if resp.status_code not in (200, 201):
        warn(f"Could not post comment (HTTP {resp.status_code}): " f"{resp.text[:200]}")
        return

    print("LLM review comment posted successfully.")


if __name__ == "__main__":
    main()
