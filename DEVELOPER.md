# Building angular-datatables

## Prerequisites

Node.js and npm are essential to Angular development.

[Get it now](https://docs.npmjs.com/getting-started/installing-node) if it's not already installed on your machine.

**Verify that you are running at least node `v10.x.x` and npm `6.x.x`**
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

- `npm run tsc` - runs the TypeScript compiler once.
- `npm run tsc:w` - runs the TypeScript compiler in watch mode; the process keeps running, awaiting changes to TypeScript files and re-compiling when it sees them.
with excellent support for Angular apps that use routing.
- `npm test` - compiles, runs and watches the karma unit tests
- `npm build` - compiles and generate the JS files

### Updating dependencies version

We use [npm-check-updates](https://www.npmjs.org/package/npm-check-updates) to update automatically the dependencies:

```bash
npm i -g npm-check-updates
ncu -u
rm -rf node_modules && npm install
```

If you want to update angular, use the cli:

```bash
ng update @angular/cli @angular/core
```

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

## Deploying the documentation to Github Pages

Run `deploy-doc.sh` to deploy the documentation to the Github Pages

You may need to have the following:

- git
- have the basic commands in your OS

```bash
./deploy-doc.sh <version>
```

## Release

```bash
# update version on package.json files
sed -i 's/"version": "\(.\+\)-dev",/"version": "\1",/g' package.json
sed -i 's/"version": "\(.\+\)-dev",/"version": "\1",/g' demo/package.json
# update the version for schematics in file 'schematics/src/ng-add/index.ts'
# build
npm run build
# commit
git add -A && git commit -m "chore: release vX.Y.Z"
git tag vX.Y.Z
git push && git push --tags
# publish
npm publish

# don't forget to set the next iteration by editing the files:
# - package.json
# - demo/package.json
git add -A && git commit -m "chore: prepare next iteration vX.Y.Z-dev"
git push
```

# Angular Schematics

To build the schematics, issue the following command:

`npm run schematics:build`

## Testing

To test schematics, you will need to setup `verdaccio`, deploy the lib locally in your machine, then install it via `ng add` in an Angular project.

### Steps

1. Install [verdaccio](https://verdaccio.org/)

   `npm install -g verdaccio`

2. Start `verdaccio` server on a terminal or (command prompt if on Windows) by running:

    `verdaccio`

3. Setup an account in `verdaccio` so you can publish the library on your machine:

    - Run `npm adduser --registry=http://localhost:4873`
    - Give a username, password and an email address to create an account in `verdaccio`. 

4. Now, publish the library to `verdaccio` by running the command:

    `npm publish angular-datatables --registry http://localhost:4873`

5. Create an empty Angular project like:

    `ng new my-demo-project`

6. Install `angular-datatables` to this demo project by running:

    `ng add --registry=http://localhost:4873 angular-datatables`

### Notes

1. The `--registry` flag informs `npm` to use `verdaccio` instead of NPM's registry server.
2. If you're facing issues with `ng add` not grabbing code from `verdaccio`, try setting npm registry endpoint to `verdaccio` like:

    `npm set registry http://localhost:4873`

3. Do remember to reset step 2 or else `npm` will stop working whenever `verdaccio` is offline!

    `npm set registry https://registry.npmjs.org`

