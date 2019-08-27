# Express Boilerplate

Yet _another_ Express boilerplate. This is my preferred starting point when making a new project with Express / TypeScript / React.

## Features

- Uses TypeScript for Express + React
- Uses Mongoose + MongoDB for ORM
- Includes a User Schema with JWT Token auth
- Eslint + Prettier for consistent code syntax

## Installation

Clone this repo into your desired directory:

```
$ git clone https://github.com/AaronPresley/express-boilerplate.git ./some-new-dir
```

Move to the new dir, and install the deps

```
$ npm i
```

Now you can start the app

```
$ npm start
```

Visit http://localhost:8080 to see the app.

## Testing

Running tests

```
$ npm test
```

Watching for test changes

```
$ npm run test:watch
```

To copy the contents to a new directory (script assumes you're within the `express_boilerplate` dir).

```
$ rsync -ax --exclude=node_modules --exclude=.git ./ /path/to/new_project
```

Then replace all found instances of `appname` with your new app's name

```
$ grep -R --exclude-dir={node_modules,dist} --include=\*.{ts,tsx} 'appname' .
```

## Questions?

Feel free to reach out to me [@AaronPresley](https://twitter.com/AaronPresley).
