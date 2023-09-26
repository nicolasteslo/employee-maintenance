
# Employee Maintenance Web APP

Number8 fullstack challenge.


## Technologies:

By far one of the most modern frameworks currently on the web is NextJS, it makes building fullstack applications much easier, specially being able to run the backend along with the frontend, whilst providing SSR and SSG capabilities.

- NextJS
- TypeScript
- Tailwind
- Prisma ORM
- Zod
- Eslint
- MySql
- Jest
- React Testing Library

## Project Structure

Since NextJS has a rigid structure with dynamic routes both for the frontend as the backend it can be tricky to follow a specific design pattern 100%, for example, it might not be intuitive for some people the fact that NextJS structures the api endpoints inside /pages directory. 

I also took the liberty to implement additional routes to automate manually creating data during development.

src/__tests__ - App tests, both for frontend and backend

src/backend - Backend specific code, containing: repositories, schemas, dtos and types

src/components - Components used in employees and employee pages

src/pages - NextJS pages directory, containing actual frontend pages aswell as API endpoints

src/services - Services meant to be consumed by the frontend.

src/utils - Helper functions

src/styles - NextJS default folder

## Prerequisites

- Node version >= 18.16.0
- MySQL database created

## How to run

- Clone the repo
- Setup MySQL Database URL in .env
- npm install
- npx prisma migrate dev
- npm run seed to populate Database with fake data
- npm run dev to start server
- npm run test to run tests
