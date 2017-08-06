# angular-datatables demo

This project was generated with [angular-cli](https://github.com/angular/angular-cli).

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build:prod` to build the project. The build artifacts will be stored in the `dist/` directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Using the current version of angular-datatables

If you need to check if the currenct version of angular-datatables still works with the demo, you can use [node-install-local](https://github.com/nicojs/node-install-local):

```bash
cd /path/to/angular-datatables
npm run build
cd demo/
rm -rf node-modules/angular-datatables
install-local ..
npm start
# Application will run on localhost:4200
```
