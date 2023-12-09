##### NPM

You need to install its dependencies:

```bash
# JS file
npm install datatables.net-fixedcolumns --save
# CSS file
npm install datatables.net-fixedcolumns-bs4 --save
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
              "node_modules/datatables.net-fixedcolumns-bs4/css/fixedColumns.bootstrap4.css"
            ],
            "scripts": [
              ...
              "node_modules/datatables.net-fixedcolumns/js/dataTables.fixedColumns.js"
            ],
            ...
}
```
