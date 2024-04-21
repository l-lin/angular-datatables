##### NPM

You need to install its dependencies:

```bash
# JS file
npm install datatables.net-select --save
# CSS file
npm install datatables.net-select-dt --save
# Typings
npm install @types/datatables.net-select --save-dev
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
              "node_modules/datatables.net-select-dt/css/select.dataTables.css"
            ],
            "scripts": [
              ...
              "node_modules/datatables.net-select/js/dataTables.select.js"
            ],
            ...
}
```
