##### NPM

You need to install its dependencies:

```bash
# If you want to export excel files
npm install jszip --save
# JS file
npm install datatables.net-buttons --save
# CSS file
npm install datatables.net-buttons-dt --save
# Typings
npm install @types/datatables.net-buttons --save-dev
```
##### angular.json

Add the dependencies in the scripts and styles attributes:

```json  
{
  "projects": {
    "your-app-name": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              ...
              "node_modules/datatables.net-buttons-dt/css/buttons.dataTables.css"
            ],
            "scripts": [
              ...
              "node_modules/jszip/dist/jszip.js",
              "node_modules/datatables.net-buttons/js/dataTables.buttons.js",
              "node_modules/datatables.net-buttons/js/buttons.colVis.js",
              "node_modules/datatables.net-buttons/js/buttons.flash.js",
              "node_modules/datatables.net-buttons/js/buttons.html5.js",
              "node_modules/datatables.net-buttons/js/buttons.print.js"
            ],
            ...
}
```
> If you want to have the excel export functionnality, then you must import the jszip.js before the buttons.html5.js file.
