# angular-datatables demo

This project was generated with [angular-cli](https://github.com/angular/angular-cli).

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run demo:build:prod` to build the project. The build artifacts will be stored in the `dist/` directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Using the current version of angular-datatables

If you need to check if the currenct version of angular-datatables still works with the demo, simply follow the instructions below:

> We use [linklocal](https://npmjs.org/package/linklocal) to link library with demo app. 

```bash
cd /path/to/angular-datatables
npm start
# The application will first build library (under dist/lib), 
# copy it to demo/node_modules and run the app on localhost:4200
```
