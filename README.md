# Express Boilerplate

Yet _another_ Express boilerplate. This is my preferred starting point when making a new project
with Express / TypeScript / React.

## Features

- Typescript for the code
- Express for backend
- React for frontend (with Redux)
- MongoDB for data
- Mongoose for the ORM
- ESLint for syntax checking
- Jest for testing
- JWT for authentication

## Copying To A New Directory

Here's a script to copy this project into a new directory without any git history (script assumes you're within the `express_boilerplate` dir).

```
$ rsync -ax --exclude=node_modules --exclude=.git ./ /path/to/new_project
```

## Getting Started

Clone this repo then run `yarn` to install dependencies.

Start in dev mode with `yarn start` - this will start both the server and webpack.
Visit http://localhost:8080 to see the app.

## Questions?

Feel free to [reach out](https://twitter.com/AaronPresley).