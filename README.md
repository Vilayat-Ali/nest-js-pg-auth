# CODE INBOUND - Assignment

## Tech Stack

- TypeScript
- Nest.js
- PostgreSQL
- JsonWebToken (JWT)

## Features

- Using `@nestjs/config` to import env variables at global contexts.
- Using custom `JWT` implementation in the `auth.service.ts` because running `npm audit` informs that passport.js library shows serious security invulnerabilities.
- Following suggested MVC architecture as imposed by Nest.js framework.
- using TypeOrm to deduce database context in the application.

## How to setup

1. Clone the repo

```
git clone https://www.github.com/<github_username>/<repo_name>.git
```

2. Create a postgresQL database `assignment` in PgAdmin4 dashboard

3. Fill the database details and other information in the .env file

4. run the server

```
yarn start:dev
```
