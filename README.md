# UOIT Signature Generator

This tool allows users to create personalized email signatures within a consistent, branded template, and email the finished signature to themselves for copying into Outlook or another email client.

**Currently supported elements:**

- Personal (name, phone, credentials, etc)
- Business (hours)
- Social networks (links or buttons)
- Imagery (logos, wordmarks, custom)
- University Feature (pre-defined university promos)
- Promotional (event details)
- Messaging (disclaimers, policies, land acknowledgement)

## Development server

Run `npm start` for a dev server with hot module reloading. Navigate to `http://localhost:4200/` to view the app.

A proxy has been set up for `http://localhost:8888/` so that an *AMP-based server can run in the background and perform PHP-related tasks, as well as serve uploaded assets. Any relative requests to `/php` or `/uploads` will be properly routed to their *AMP server from the app.

See the [Content Edits section](#content-edits) for notes on making changes to signature data (i.e. adding new logos or social networks).

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

**Test build**

Run `npm run build` to build the project for testing inside a local *AMP environment. The build artifacts will be stored in the `dist/` directory, and all URLs will reflect that as the base directory (most likely to be `http://localhost:8888/uoit-signature-generator/dist`).

**Production (server) build**

Run `npm run prod` to build the project for uploading to a live production server. Ensure the `--base-href` option of the NPM build script points to the correct production server directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Content edits

Model files that store content-related data can be found in `/src/app/shared/models`. Related data includes:

- logos
- icons
- social networks

To add new selection options to the signature generator, any new assets must be referred to in a model file.
