# Building angular-datatables

## Prerequisites

Node.js and npm are essential to Angular development.

[Get it now](https://docs.npmjs.com/getting-started/installing-node) if it's not already installed on your machine.

**Verify that you are running at least node `v18.19.x` and npm `10.2.x`**
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

**Attention Windows Developers: You must run all of these commands in administrator mode**.

```bash
npm install
npm run build
```

The `npm run build` command compiles the library,

### npm scripts

We've captured many of the most useful commands in npm scripts defined in the `package.json`:

- `npm start` - Run the demo/docs app locally.
- `npm demo:test` - compiles, runs and watches the karma unit tests (`*.spec.ts` files)
- `npm run build:lib` - compiles and generates prod builds for this library

### Updating dependencies version

We use [npm-check-updates](https://www.npmjs.org/package/npm-check-updates) to update automatically the dependencies:

```bash
npm i -g npm-check-updates
ncu -u
rm -rf node_modules && npm install
```

If you want to update Angular to latest version:

```bash
ng update @angular/cli @angular/core
```

You can also install a specific Angular version using the below code:

```bash
# Downgrade to Angular 15
ng update @angular/cli@15 @angular/core@15
```

## Testing

These tools are configured for specific conventions described below.

> It is unwise and rarely possible to run the application and the unit tests at the same time.
>
> We recommend that you shut down one before starting another.

### Unit Tests

Unit tests are essential for ensuring that the library remains compatible with the constantly evolving Angular framework. The more tests, the better :)

You can find these tests in the `demo/src` folder, easily recognizable by their filenames ending with `xxx.spec.ts`.

For instance: `demo/src/app/app.component.spec.ts`

Feel free to add more `.spec.ts` files as needed; karma is set up to locate them.

To run the tests, simply use `npm run demo:test`

This command will compile the application first, then proceed to re-compile and run the karma test-runner simultaneously.
Both the compiler and karma will be on the lookout for any file changes.

The test-runner output will be displayed in the terminal window.

By updating our app and tests in real-time, we can keep an eye on the console for any failing tests.

Karma (test runner) is occasionally confused and it is often necessary to shut down its browser or even shut the command down (Ctrl-C) and restart it. No worries; it's pretty quick.

## Deploying the documentation to Github Pages

Run `deploy-doc.sh` to deploy the documentation to the Github Pages

You may need to have the following:

- `git`
- have the basic commands in your OS

```bash
./deploy-doc.sh <version>
```

## Release

```sh
# this will create a new version and push to remote repository
npm version [<newversion> | major | minor | patch]

# examples
# create a patch version to publish fixes to the package
npm version patch
# provide a commit message ('%s' will be replaced by the version number)
npm version patch -m "chore: release %s"
# create a minor version to publish new features
npm version minor
# create a major version to follow Angular major version
npm version major
# more control to the version to set
npm version 8.3.2
```

Then go to the [release page](https://github.com/l-lin/angular-datatables/releases) and manually
create a new release. There is an automatic [Github action](./.github/workflows/publish.yml) that
publishes automatically to NPM repository.

# Angular Schematics

We use Angular Schematics for `ng add` functionality.

To build the schematics, issue the following command:

`npm run lib:schematics:build`

## Testing

To test schematics, you will need to setup `verdaccio`, publish the library locally in your machine, then install it via `ng add` in another Angular project, preferably a newly created one in another terminal window.

### Steps

1. Install [verdaccio](https://verdaccio.org/)

   `npm install -g verdaccio`

2. Start `verdaccio` server on a terminal or (command prompt if on Windows) by running:

   `verdaccio`

3. Setup an account in `verdaccio` so you can publish the library on your machine:

   - Run `npm adduser --registry=http://localhost:4873`
   - Give a username, password and an email address to create an account in `verdaccio`.

4. Make your changes in the project.

5. Run `npm run build:lib` to build the library and `ng add` functionality related code.

6. Now, publish the library to `verdaccio` by running the command:

   ```sh
   # Make sure you compiled the library first! 
   # `npm run build:lib`
   cd dist/lib
   npm publish --registry http://localhost:4873
   ```

5. Create an empty Angular project like:

   `ng new my-demo-project`

6. Install `angular-datatables` to this demo project by running:

   `ng add --registry=http://localhost:4873 angular-datatables`

### Notes

1. The `--registry` flag informs `npm` to use `verdaccio` instead of NPM's registry server.
2. If you're facing issues with `ng add` not grabbing code from `verdaccio`, try setting npm registry endpoint to `verdaccio` like:

   `npm config set registry http://localhost:4873`

3. Remember to reset changes made in step 2 or else `npm` will stop working when `verdaccio` is killed.

   `npm config set registry https://registry.npmjs.org`
