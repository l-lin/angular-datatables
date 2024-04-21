##### NPM

You need to install its dependencies:

```bash
# If you want to export excel files
npm install jszip --save
# JS file
npm install datatables.net-buttons --save
# CSS file (replace `-dt` with the appropriate CSS library)
npm install datatables.net-buttons-dt --save
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
              "node_modules/datatables.net-buttons-dt/css/buttons.dataTables.min.css",
            ],
            "scripts": [
              ...
              "node_modules/jszip/dist/jszip.js",
              "node_modules/datatables.net-buttons/js/dataTables.buttons.min.js",
              "node_modules/datatables.net-buttons/js/buttons.colVis.min.js",
              "node_modules/datatables.net-buttons/js/buttons.flash.min.js",
              "node_modules/datatables.net-buttons/js/buttons.html5.min.js",
              "node_modules/datatables.net-buttons/js/buttons.print.min.js",
            ],
            ...
}
```
> If you want to have the excel export functionnality, then you must import the jszip.js before the buttons.html5.js file.
