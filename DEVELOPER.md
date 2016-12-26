# Building angular-datatables

## Prerequisites

Node.js and npm are essential to Angular 2 development.

[Get it now](https://docs.npmjs.com/getting-started/installing-node) if it's not already installed on your machine.

**Verify that you are running at least node `v4.x.x` and npm `3.x.x`**
by running `node -v` and `npm -v` in a terminal/console window.
Older versions produce errors.

We recommend [nvm](https://github.com/creationix/nvm) or [n](https://github.com/tj/n) for managing multiple versions of node and npm.

## Clone this project

Clone this repo into new project folder (e.g., `my-proj`).
```bash
git clone  https://github.com/l-lin/angular-datatables
cd angular-datatables
```

## Install npm packages

> See npm, n and nvm version notes above

Install the npm packages described in the `package.json` and verify that it works:

**Attention Windows Developers:  You must run all of these commands in administrator mode**.

```bash
npm install
npm run build
```

The `npm run build` command compiles the library,

### npm scripts

We've captured many of the most useful commands in npm scripts defined in the `package.json`:

* `npm run tsc` - runs the TypeScript compiler once.
* `npm run tsc:w` - runs the TypeScript compiler in watch mode; the process keeps running, awaiting changes to TypeScript files and re-compiling when it sees them.
with excellent support for Angular apps that use routing.
* `npm test` - compiles, runs and watches the karma unit tests
* `npm build` - compiles and generate the JS files

## Testing

These tools are configured for specific conventions described below.

*It is unwise and rarely possible to run the application, the unit tests, and the e2e tests at the same time.
We recommend that you shut down one before starting another.*

### Unit Tests
TypeScript unit-tests are usually in the `src` folder. Their filenames must end in `.spec`.

Look for the example `src/angular-datatables.directive.spec.ts`.
Add more `.spec.ts` files as you wish; we configured karma to find them.

Run it with `npm test`

That command first compiles the application, then simultaneously re-compiles and runs the karma test-runner.
Both the compiler and the karma watch for (different) file changes.

Shut it down manually with Ctrl-C.

Test-runner output appears in the terminal window.
We can update our app and our tests in real-time, keeping a weather eye on the console for broken tests.
Karma is occasionally confused and it is often necessary to shut down its browser or even shut the command down (Ctrl-C) and
restart it. No worries; it's pretty quick.

The `HTML-Reporter` is also wired in. That produces a prettier output; look for it in `~_test-output/tests.html`.
