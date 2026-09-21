#!/usr/bin/env python3
"""
Requests a short-lived GitHub App installation access token for the Deliverino
app (https://github.com/apps/deliverino) and prints it to stdout.

Reads the base64-encoded private key from the ``DELIVERINO_PRIVATE_KEY``
environment variable (provided by the CircleCI "deliverino" context), signs a
JSON web token valid for 10 minutes, looks up the app's installation on this
repository, and exchanges it for an installation access token valid for 1
hour.
"""

import os
from base64 import b64decode
from datetime import datetime, timedelta

import jwt
import requests

# https://github.com/apps/deliverino
DELIVERINO_APP_ID = "59249"


def require_env(name):
    try:
        return os.environ[name]
    except KeyError as e:
        raise RuntimeError(
            f"Missing environment variable {name!r}. Please make sure this "
            "step has access to the 'deliverino' CircleCI context."
        ) from e


def main():
    deliverino_private_key = require_env("DELIVERINO_PRIVATE_KEY")
    owner = require_env("CIRCLE_PROJECT_USERNAME")
    repo = require_env("CIRCLE_PROJECT_REPONAME")

    payload = {
        # issued at time, 60 seconds in the past to allow for clock drift
        "iat": int(datetime.timestamp(datetime.now() - timedelta(minutes=1))),
        # JWT expiration time (10 minute maximum)
        "exp": int(datetime.timestamp(datetime.now() + timedelta(minutes=9))),
        # GitHub App's identifier
        "iss": DELIVERINO_APP_ID,
    }
    encoded_jwt = jwt.encode(
        payload, b64decode(deliverino_private_key), algorithm="RS256"
    )
    jwt_headers = {
        "Authorization": f"Bearer {encoded_jwt}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    # Look up the installation id for this repo rather than hard-coding it,
    # so the script works unmodified for any repo the app is installed on.
    installation_response = requests.get(
        f"https://api.github.com/repos/{owner}/{repo}/installation",
        headers=jwt_headers,
        timeout=30,
    )
    installation_response.raise_for_status()
    installation_id = installation_response.json()["id"]

    token_response = requests.post(
        f"https://api.github.com/app/installations/{installation_id}/access_tokens",
        headers=jwt_headers,
        timeout=30,
    )
    token_response.raise_for_status()
    print(token_response.json()["token"])


if __name__ == "__main__":
    main()
