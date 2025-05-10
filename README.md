# Digitale Berechtigungskarte

[![CircleCI build status](https://circleci.com/gh/digitalfabrik/entitlementcard.svg?style=svg)](https://app.circleci.com/pipelines/github/digitalfabrik/entitlementcard)
[![frontend style: effective dart](https://img.shields.io/badge/style-effective_dart-40c4ff.svg)](https://pub.dev/packages/effective_dart)

> App for 'Digitale Berechtigungskarten', generally benefit card for volunteers or socially vulnerable groups in
> Germany.
>
> App for Android & iOS + Backend + Administration Web Portal – 100% Open Source.

## Getting Started

* [Development Setup](./docs/development-setup.md)
* [Conventions](./docs/conventions.md)
* [Backend First Steps](./docs/backend-first-steps.md)

## Documentation

* [Manual Releases](./docs/manual-release)
* [CI/CD](./docs/cicd.md)
* [Troubleshooting](./docs/troubleshooting.md)
* [GraphQL Code Generation](./docs/graphql_generation.md)
* [Protobuf Code Generation](./docs/protobuf-generation.md)
* [Migrations](./docs/migrations.md)
* [Deep Linking](./docs/deep-linking.md)
* [Domains & Projects](./docs/domains-projects.md)

## What is a "entitlementcard"

Short answer, it is a whitelabel for benefit cards in Germany, mainly targeted at volunteers and socially vulnerable
groups.

To name some examples, this project has a whitelabel for

- the [digital volunteer card](#what-is-a-_ehrenamtskarte_) and
- the Nuremberg Social Pass

### What is a _Ehrenamtskarte_?

A _Ehrenamtskarte_ is a benefit card for volunteers in Bavaria, Germany.

Translated from [Wikipedia](https://de.wikipedia.org/wiki/Ehrenamtskarte):

> The Ehrenamtskarte (also Ehrenamtspass) is a personal document in Germany that serves as proof of special
> voluntary commitment. Such a document can be issued, for example, by the state, federal states,
> municipalities or volunteer agencies.
>
> Depending on how it is implemented, it may be linked to documentation of the type and scope of the activity,
> the skills required for it and any qualification measures. An Ehrenamtskarte or Freiwilligenausweis can also bring
> certain benefits, such as discounts on tickets or access to museums or other public institutions, or benefits
> with cooperation partners, such as companies, institutions and other supporters.

## Features

**This project consists of the following components:**

- A mobile app for Android and iOS in the folder `frontend`. [Flutter](https://flutter.dev/) was used to implement the
  app.
  The app offers the following functions:
    - Display of accepting stores from different categories with different symbols on a map.
    - Display details of an accepting store with descriptive text, address, phone number, email address and website.
    - A page to browse accepting stores with optional sorting by distance from the current location.
    - An ID function for an entitlementcard
    - A reliable way to verify another entitlementcard.
    - An application form for a new volunteer card.
- A `backend` implemented in Kotlin (JVM) that is responsible for the management of all accruing data.
    - Interfaces for the app: retrieving accepting stores, verifying digital volunteer cards and receiving applications.
    - Interface for the administration web portal: Entering new digital volunteer cards and querying applications.
- A web portal for the administration of digital volunteer cards, implemented with [React](https://reactjs.org/) in the
  folder `administration`.
- A Postgres or [PostGIS](https://postgis.net/) database to store the accepting stores, as well as the digital volunteer
  cards and applications.
- [Martin](https://github.com/urbica/martin), for queries to display accepting stores on the map.

## About the project

This project was created by 6 students of
the [Software Engineering Master's programme](https://elite-se.informatik.uni-augsburg.de/) of Universität Augsburg,
TU München und LMU München.

We were supported by [Tür an Tür – Digitalfabrik gGmbH](https://tuerantuer.de/digitalfabrik/) in our cooperation
with the _Bayerisches Staatsministerium für Familie, Arbeit und Soziales_ (Bavarian State Ministry for Family, Labour
and Social Affairs).

2023 the project became part of *Tür an Tür - Digitalfabrik*.

## Contributing

First, make sure you have a look at our [conventions](docs/conventions.md).

You can contribute by reporting bugs or creating and reviewing pull requests.

If you want to know more about the entitlementcard project or if you want to join us,
contact [Andy](mailto:andreas.fischer@tuerantuer.org),
[Tory](mailto:viktoria.seluianova@tuerantuer.org) or [our info mail](mailto:info@tuerantuer.org) and visit
our [website](https://tuerantuer.de/digitalfabrik/).

## Resources about the Ehrenamtskarte (legacy)

See [https://github.com/digitalfabrik/ehrenamtskarte-artefacts](https://github.com/digitalfabrik/ehrenamtskarte-artefacts)
[![Demo Video](https://img.youtube.com/vi/YsEAVG6efVU/0.jpg)]( https://youtu.be/YsEAVG6efVU "Digitale Ehrenamtskarte: Demo und Technologie")
