# Kham API

## Installation

### .env
```bash
$ cp .env.sample .env
```
and fill the variables in the .env file

### Dependencies and Migrations

```bash
$ yarn install

# database Migrations
$ yarn drizzle:migrate
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
